<?php

namespace App\Persistence\Project\Mapper;

use App\Business\Project\Model\TaskModel;
use App\Persistence\Project\Entity\Task;

class TaskMapper
{
    public static function toModel(Task $task): TaskModel
    {
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
    }
}
