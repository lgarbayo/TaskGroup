<?php

namespace App\Business\Project\Model;

class MilestoneModel
{
    public function __construct(
        public readonly string $uuid,
        public readonly string $projectUuid,
        public readonly string $title,
        public readonly ?string $description,
        public readonly int $dateYear,
        public readonly int $dateMonth,
        public readonly int $dateWeek,
    ) {
    }
}
