<?php

namespace App\Business\Project\Port;

use App\Persistence\Project\Entity\Milestone;
use App\Persistence\Project\Entity\Project;

interface MilestoneRepository
{
    public function list(Project $project): iterable;

    public function create(Project $project, array $data): Milestone;

    public function update(Milestone $milestone, array $data): Milestone;

    public function delete(Milestone $milestone): void;
}
