<?php

namespace App\Business\Analysis\Model;

use App\Business\Project\Model\ProjectModel;

class ProjectAnalysisModel
{
    /**
     * @param MilestoneAnalysisModel[] $milestoneList
     */
    public function __construct(
        public readonly ProjectModel $project,
        public readonly array $milestoneList = [],
    ) {
    }
}
