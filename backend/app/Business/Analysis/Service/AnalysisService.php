<?php

namespace App\Business\Analysis\Service;

use App\Business\Analysis\Model\ProjectAnalysisModel;
use App\Business\Analysis\Port\AnalysisRepository;

class AnalysisService
{
    public function __construct(private AnalysisRepository $repository)
    {
    }

    public function projectAnalysis(string $projectUuid, int $userId): ProjectAnalysisModel
    {
        return $this->repository->projectAnalysis($projectUuid, $userId);
    }
}
