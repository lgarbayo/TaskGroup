<?php

namespace App\Business\Analysis\Model;

class TaskAnalysisModel
{
    public function __construct(
        public readonly string $taskUuid,
        public readonly string $taskTitle,
        public readonly float $initialCompletion,
        public readonly float $endCompletion,
    ) {
    }
}
