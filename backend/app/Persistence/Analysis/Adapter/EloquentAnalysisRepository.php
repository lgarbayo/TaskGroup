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

        $tasks = collect($project->tasks);
        $segments = [];

        foreach ($milestones as $milestone) {
            $assignedTasks = $tasks->filter(fn (TaskModel $task) => ($task->milestone['uuid'] ?? null) === $milestone->uuid);
            $segments[] = $this->createAssignedSegment($project, $milestone, $assignedTasks);
        }

        $unassigned = $tasks->filter(fn (TaskModel $task) => empty($task->milestone));
        if ($unassigned->isNotEmpty() || $segments === []) {
            $segments[] = $this->createAssignedSegment($project, null, $unassigned);
        }

        return $segments;
    }

    private function createAssignedSegment(ProjectModel $project, ?MilestoneModel $milestone, $tasks): MilestoneAnalysisModel
    {
        $taskList = collect($tasks)->map(function (TaskModel $task) {
            return new TaskAnalysisModel(
                taskUuid: $task->uuid,
                taskTitle: $task->title,
                initialCompletion: 0.0,
                endCompletion: $task->status === 'done' ? 1.0 : 0.0,
            );
        })->values();

        $endCompletion = $taskList->isNotEmpty()
            ? round($taskList->avg(fn (TaskAnalysisModel $model) => $model->endCompletion), 4)
            : 0.0;

        $startDate = $milestone
            ? ['year' => $milestone->dateYear, 'month' => $milestone->dateMonth, 'week' => $milestone->dateWeek]
            : ['year' => $project->startYear, 'month' => $project->startMonth, 'week' => $project->startWeek];

        $endDate = $milestone
            ? ['year' => $milestone->dateYear, 'month' => $milestone->dateMonth, 'week' => $milestone->dateWeek]
            : ['year' => $project->endYear, 'month' => $project->endMonth, 'week' => $project->endWeek];

        $milestoneUuid = $milestone?->uuid ?? sprintf('%s-general', $project->uuid);
        $milestoneTitle = $milestone?->title ?? 'General';

        return new MilestoneAnalysisModel(
            milestoneUuid: $milestoneUuid,
            milestoneTitle: $milestoneTitle,
            startDate: $startDate,
            endDate: $endDate,
            initialCompletion: 0.0,
            endCompletion: $endCompletion,
            taskList: $taskList->all(),
        );
    }

    private function dateToIndex(int $year, int $month, int $week): int
    {
        return (($year * 12) + $month) * 4 + $week;
    }
}
