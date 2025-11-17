<?php

namespace App\Persistence\Project\Mapper;

use App\Business\Project\Model\ProjectModel;
use App\Business\Project\Model\TaskModel;
use App\Business\Project\Model\MilestoneModel;
use App\Persistence\Project\Entity\Project;

class ProjectMapper
{
    public static function toModel(Project $project, bool $withRelations = false): ProjectModel
    {
        $members = [];
        $tasks = [];
        $milestones = [];

        if ($withRelations) {
            $members = $project->members->map(fn ($m) => [
                'id' => $m->id,
                'alias' => $m->alias,
                'email' => $m->email,
                'role' => $m->pivot->role ?? 'member',
            ])->all();

            $tasks = $project->tasks->map(function ($task) {
                return new TaskModel(
                    uuid: $task->uuid,
                    projectUuid: $task->project->uuid,
                    title: $task->title,
                    description: $task->description,
                    startYear: $task->start_year,
                    startMonth: $task->start_month,
                    startWeek: $task->start_week,
                    durationWeeks: $task->duration_weeks,
                    status: $task->status,
                    assignee: $task->assignee ? [
                        'id' => $task->assignee->id,
                        'alias' => $task->assignee->alias,
                        'email' => $task->assignee->email,
                    ] : null,
                );
            })->all();

            $milestones = $project->milestones->map(function ($m) use ($project) {
                return new MilestoneModel(
                    uuid: $m->uuid,
                    projectUuid: $project->uuid,
                    title: $m->title,
                    description: $m->description,
                    dateYear: $m->date_year,
                    dateMonth: $m->date_month,
                    dateWeek: $m->date_week,
                );
            })->all();
        }

        return new ProjectModel(
            uuid: $project->uuid,
            ownerId: $project->owner_id,
            title: $project->title,
            description: $project->description,
            startYear: $project->start_year,
            startMonth: $project->start_month,
            startWeek: $project->start_week,
            endYear: $project->end_year,
            endMonth: $project->end_month,
            endWeek: $project->end_week,
            additionalFields: $project->additional_fields,
            members: $members,
            tasks: $tasks,
            milestones: $milestones,
        );
    }
}
