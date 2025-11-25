<?php

namespace App\Business\Project\Model;

class TaskModel
{
    public function __construct(
        public readonly string $uuid,
        public readonly string $projectUuid,
        public readonly string $title,
        public readonly ?string $description,
        public readonly int $startYear,
        public readonly int $startMonth,
        public readonly int $startWeek,
        public readonly int $durationWeeks,
        public readonly string $status,
        public readonly ?array $assignee = null,
        public readonly ?array $milestone = null,
    ) {
    }
}
