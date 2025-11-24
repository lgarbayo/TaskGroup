<?php

namespace App\Business\Analysis\Model;

class MilestoneAnalysisModel
{
    /**
     * @param array{year:int,month:int,week:int} $startDate
     * @param array{year:int,month:int,week:int} $endDate
     * @param TaskAnalysisModel[] $taskList
     */
    public function __construct(
        public readonly string $milestoneUuid,
        public readonly string $milestoneTitle,
        public readonly array $startDate,
        public readonly array $endDate,
        public readonly float $initialCompletion,
        public readonly float $endCompletion,
        public readonly array $taskList = [],
    ) {
    }
}
