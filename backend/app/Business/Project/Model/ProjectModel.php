<?php

namespace App\Business\Project\Model;

class ProjectModel
{
    public function __construct(
        public readonly string $uuid,
        public readonly int $ownerId,
        public readonly string $title,
        public readonly ?string $description,
        public readonly int $startYear,
        public readonly int $startMonth,
        public readonly int $startWeek,
        public readonly int $endYear,
        public readonly int $endMonth,
        public readonly int $endWeek,
        public readonly ?array $additionalFields = null,
        public readonly array $members = [],
        public readonly array $tasks = [],
        public readonly array $milestones = [],
        public readonly array $invitations = []
    ) {
    }
}
