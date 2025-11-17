<?php

namespace App\Business\Project\Service;

use App\Business\Project\Port\MilestoneRepository;
use App\Persistence\Project\Entity\Milestone;
use App\Persistence\Project\Entity\Project;

class MilestoneService
{
    public function __construct(private MilestoneRepository $milestones)
    {
    }

    public function list(Project $project): iterable
    {
        return $this->milestones->list($project);
    }

    public function create(Project $project, array $data): Milestone
    {
        return $this->milestones->create($project, $data);
    }

    public function update(Milestone $milestone, array $data): Milestone
    {
        return $this->milestones->update($milestone, $data);
    }

    public function delete(Milestone $milestone): void
    {
        $this->milestones->delete($milestone);
    }
}
