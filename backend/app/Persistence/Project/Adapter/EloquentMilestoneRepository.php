<?php

namespace App\Persistence\Project\Adapter;

use App\Business\Project\Port\MilestoneRepository;
use App\Persistence\Project\Entity\Milestone;
use App\Persistence\Project\Entity\Project;

class EloquentMilestoneRepository implements MilestoneRepository
{
    public function list(Project $project): iterable
    {
        return $project->milestones()
            ->orderBy('date_year')
            ->orderBy('date_month')
            ->orderBy('date_week')
            ->get();
    }

    public function create(Project $project, array $data): Milestone
    {
        return $project->milestones()->create($data);
    }

    public function update(Milestone $milestone, array $data): Milestone
    {
        $milestone->update($data);

        return $milestone->fresh();
    }

    public function delete(Milestone $milestone): void
    {
        $milestone->delete();
    }
}
