<?php

namespace App\Persistence\Analysis\Adapter;

use App\Business\Analysis\Model\MilestoneAnalysisModel;
use App\Business\Analysis\Model\ProjectAnalysisModel;
use App\Business\Analysis\Model\TaskAnalysisModel;
use App\Business\Analysis\Port\AnalysisRepository;
use App\Business\Project\Model\MilestoneModel;
use App\Business\Project\Model\ProjectModel;
use App\Business\Project\Model\TaskModel;
use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Mapper\ProjectMapper;
use Illuminate\Database\Eloquent\Builder;

class EloquentAnalysisRepository implements AnalysisRepository
{
    public function projectAnalysis(string $projectUuid, int $userId): ProjectAnalysisModel
    {
        $project = Project::query()
            ->where('uuid', $projectUuid)
            ->where(function (Builder $builder) use ($userId) {
                $builder
                    ->where('owner_id', $userId)
                    ->orWhereHas('members', fn ($members) => $members->where('user_id', $userId));
            })
            ->with(['tasks', 'milestones'])
            ->firstOrFail();

        $projectModel = ProjectMapper::toModel($project, withRelations: true);
        $milestoneAnalysis = $this->buildMilestoneAnalysis($projectModel);

        return new ProjectAnalysisModel($projectModel, $milestoneAnalysis);
    }

    /**
     * @return MilestoneAnalysisModel[]
     */
    private function buildMilestoneAnalysis(ProjectModel $project): array
    {
        $milestones = collect($project->milestones)
            ->sortBy(fn (MilestoneModel $milestone) => $this->dateToIndex(
                $milestone->dateYear,
                $milestone->dateMonth,
                $milestone->dateWeek
            ))
            ->values();

        if ($milestones->isEmpty()) {
            return [];
        }

        $tasks = collect($project->tasks)
            ->sortBy(fn (TaskModel $task) => $this->dateToIndex(
                $task->startYear,
                $task->startMonth,
                $task->startWeek
            ))
            ->values();

        $tasksByMilestone = [];
        foreach ($milestones as $milestone) {
            $tasksByMilestone[$milestone->uuid] = [];
        }

        foreach ($tasks as $task) {
            $targetMilestone = $this->resolveTargetMilestone($milestones, $task);
            if ($targetMilestone) {
                $tasksByMilestone[$targetMilestone->uuid][] = $task;
            }
        }

        $analysisDate = new \DateTimeImmutable('now');
        $segments = [];

        foreach ($milestones as $milestone) {
            $taskAnalyses = $this->buildTaskAnalyses(
                $tasksByMilestone[$milestone->uuid] ?? [],
                $analysisDate
            );

            $initialCompletion = $this->calculateAverageCompletion(
                $taskAnalyses,
                fn (TaskAnalysisModel $model) => $model->initialCompletion
            );
            $endCompletion = $this->calculateAverageCompletion(
                $taskAnalyses,
                fn (TaskAnalysisModel $model) => $model->endCompletion
            );

            $segments[] = new MilestoneAnalysisModel(
                milestoneUuid: $milestone->uuid,
                milestoneTitle: $milestone->title,
                startDate: [
                    'year' => $milestone->dateYear,
                    'month' => $milestone->dateMonth,
                    'week' => $milestone->dateWeek,
                ],
                endDate: [
                    'year' => $milestone->dateYear,
                    'month' => $milestone->dateMonth,
                    'week' => $milestone->dateWeek,
                ],
                initialCompletion: $initialCompletion,
                endCompletion: $endCompletion,
                taskList: $taskAnalyses,
            );
        }

        return $segments;
    }

    /**
     * @param MilestoneModel[] $milestones
     */
    private function resolveTargetMilestone($milestones, TaskModel $task): ?MilestoneModel
    {
        $taskIndex = $this->dateToIndex($task->startYear, $task->startMonth, $task->startWeek);
        $lastVisited = null;

        foreach ($milestones as $milestone) {
            $milestoneIndex = $this->dateToIndex($milestone->dateYear, $milestone->dateMonth, $milestone->dateWeek);
            if ($milestoneIndex >= $taskIndex) {
                return $milestone;
            }
            $lastVisited = $milestone;
        }

        return $lastVisited;
    }

    /**
     * @param TaskModel[] $tasks
     * @return TaskAnalysisModel[]
     */
    private function buildTaskAnalyses(array $tasks, \DateTimeImmutable $analysisDate): array
    {
        if ($tasks === []) {
            return [];
        }

        $taskAnalyses = [];
        foreach ($tasks as $task) {
            $initialCompletion = $this->calculateTaskCompletion($task, $analysisDate);
            $deadline = $this->taskEndDate($task);
            $endCompletion = $this->calculateTaskCompletion($task, $deadline);

            $taskAnalyses[] = new TaskAnalysisModel(
                taskUuid: $task->uuid,
                taskTitle: $task->title,
                initialCompletion: $initialCompletion,
                endCompletion: $endCompletion,
            );
        }

        return $taskAnalyses;
    }

    private function calculateTaskCompletion(TaskModel $task, \DateTimeImmutable $analysisDate): float
    {
        $startDate = $this->toDate($task->startYear, $task->startMonth, $task->startWeek);
        $endDate = $this->taskEndDate($task);

        if ($analysisDate < $startDate) {
            return 0.0;
        }

        if ($analysisDate >= $endDate) {
            return 1.0;
        }

        $totalDays = max(1, (int) $startDate->diff($endDate)->format('%a'));
        $elapsedDays = max(0, (int) $startDate->diff($analysisDate)->format('%a'));
        $completion = $elapsedDays / $totalDays;

        return max(0.0, min(1.0, $completion));
    }

    private function taskEndDate(TaskModel $task): \DateTimeImmutable
    {
        $startDate = $this->toDate($task->startYear, $task->startMonth, $task->startWeek);
        $weeks = max(1, $task->durationWeeks);
        return $startDate->modify(sprintf('+%d weeks', $weeks));
    }

    private function calculateAverageCompletion(array $taskAnalyses, callable $extractor): float
    {
        if ($taskAnalyses === []) {
            return 0.0;
        }

        $sum = 0.0;
        foreach ($taskAnalyses as $analysis) {
            $sum += $extractor($analysis);
        }

        return $sum / count($taskAnalyses);
    }

    private function toDate(int $year, int $month, int $week): \DateTimeImmutable
    {
        $normalizedMonth = $month + 1;
        $date = new \DateTimeImmutable(sprintf('%04d-%02d-01', $year, $normalizedMonth));
        return $date->modify(sprintf('+%d weeks', $week));
    }

    private function dateToIndex(int $year, int $month, int $week): int
    {
        return (($year * 12) + $month) * 4 + $week;
    }
}
