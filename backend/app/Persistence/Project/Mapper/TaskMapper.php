<?php

namespace App\Persistence\Project\Mapper;

use App\Business\Project\Model\TaskModel;
use App\Persistence\Project\Entity\Task;

class TaskMapper
{
    public static function toModel(Task $task): TaskModel
    {
        $assignees = $task->assignees?->map(fn ($assignee) => [
            'id' => $assignee->id,
            'alias' => $assignee->alias,
            'email' => $assignee->email,
        ])->values()->all() ?? [];

        if ($assignees === [] && $task->assignee) {
            $assignees = [[
                'id' => $task->assignee->id,
                'alias' => $task->assignee->alias,
                'email' => $task->assignee->email,
            ]];
        }

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
            priority: $task->priority ?? 'medium',
            assignee: $task->assignee ? [
                'id' => $task->assignee->id,
                'alias' => $task->assignee->alias,
                'email' => $task->assignee->email,
            ] : null,
            assignees: $assignees,
            milestone: $task->milestone ? [
                'uuid' => $task->milestone->uuid,
                'title' => $task->milestone->title,
            ] : null,
        );
    }
}
