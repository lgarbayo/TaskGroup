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
            ->sortBy(fn (MilestoneModel $milestone) => $this->dateToIndex($milestone->dateYear, $milestone->dateMonth, $milestone->dateWeek))
            ->values();

        $segments = [];
        $startIndex = $this->dateToIndex($project->startYear, $project->startMonth, $project->startWeek);
        $projectEndIndex = $this->dateToIndex($project->endYear, $project->endMonth, $project->endWeek);

        if ($milestones->isEmpty()) {
            $segments[] = $this->createSegment(null, $project, $startIndex, $projectEndIndex);

            return $segments;
        }

        foreach ($milestones as $milestone) {
            $milestoneIndex = $this->dateToIndex($milestone->dateYear, $milestone->dateMonth, $milestone->dateWeek);

            if ($milestoneIndex <= $startIndex) {
                continue;
            }

            $segments[] = $this->createSegment($milestone, $project, $startIndex, $milestoneIndex);
            $startIndex = $milestoneIndex;
        }

        if ($startIndex < $projectEndIndex) {
            $segments[] = $this->createSegment(null, $project, $startIndex, $projectEndIndex);
        }

        return $segments;
    }

    private function createSegment(?MilestoneModel $milestone, ProjectModel $project, int $startIndex, int $endIndex): MilestoneAnalysisModel
    {
        $tasks = collect($project->tasks)->filter(fn (TaskModel $task) => $this->taskOverlaps($task, $startIndex, $endIndex));

        $taskList = $tasks->map(function (TaskModel $task) use ($startIndex, $endIndex) {
            $initial = $this->progressAt($task, $startIndex);
            $end = $this->progressAt($task, $endIndex);

            return new TaskAnalysisModel(
                taskUuid: $task->uuid,
                taskTitle: $task->title,
                initialCompletion: round($initial, 4),
                endCompletion: round($end, 4),
            );
        })->values();

        $initialCompletion = $taskList->isNotEmpty()
            ? round($taskList->avg(fn (TaskAnalysisModel $model) => $model->initialCompletion), 4)
            : 0.0;

        $endCompletion = $taskList->isNotEmpty()
            ? round($taskList->avg(fn (TaskAnalysisModel $model) => $model->endCompletion), 4)
            : 0.0;

        $startDate = $this->indexToDate($startIndex);
        $endDate = $this->indexToDate($endIndex);

        $milestoneUuid = $milestone?->uuid ?? sprintf('%s-closure-%d', $project->uuid, $endIndex);
        $milestoneTitle = $milestone?->title ?? 'Cierre del proyecto';

        return new MilestoneAnalysisModel(
            milestoneUuid: $milestoneUuid,
            milestoneTitle: $milestoneTitle,
            startDate: $startDate,
            endDate: $endDate,
            initialCompletion: $initialCompletion,
            endCompletion: $endCompletion,
            taskList: $taskList->all(),
        );
    }

    private function taskOverlaps(TaskModel $task, int $startIndex, int $endIndex): bool
    {
        $taskStart = $this->dateToIndex($task->startYear, $task->startMonth, $task->startWeek);
        $duration = max(1, $task->durationWeeks);
        $taskEnd = $taskStart + $duration;

        return $taskEnd > $startIndex && $taskStart < $endIndex;
    }

    private function progressAt(TaskModel $task, int $referenceIndex): float
    {
        $taskStart = $this->dateToIndex($task->startYear, $task->startMonth, $task->startWeek);
        $duration = max(1, $task->durationWeeks);
        $taskEnd = $taskStart + $duration;

        if ($referenceIndex <= $taskStart) {
            return 0.0;
        }

        if ($referenceIndex >= $taskEnd) {
            return 1.0;
        }

        $elapsed = $referenceIndex - $taskStart;

        return min(1, max(0, $elapsed / $duration));
    }

    private function dateToIndex(int $year, int $month, int $week): int
    {
        return (($year * 12) + $month) * 4 + $week;
    }

    /**
     * @return array{year:int,month:int,week:int}
     */
    private function indexToDate(int $index): array
    {
        $week = $index % 4;
        $monthTotal = intdiv($index, 4);
        $month = $monthTotal % 12;
        $year = intdiv($monthTotal, 12);

        return [
            'year' => $year,
            'month' => $month,
            'week' => $week,
        ];
    }
}
