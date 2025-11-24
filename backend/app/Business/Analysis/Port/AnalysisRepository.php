<?php

namespace App\Business\Analysis\Port;

use App\Business\Analysis\Model\ProjectAnalysisModel;

interface AnalysisRepository
{
    public function projectAnalysis(string $projectUuid, int $userId): ProjectAnalysisModel;
}
