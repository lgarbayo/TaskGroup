<?php

namespace App\Persistence\Project\Adapter;

use App\Business\Project\Model\MilestoneModel;
use App\Business\Project\Port\MilestoneRepository;
use App\Persistence\Project\Entity\Milestone;
use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Mapper\MilestoneMapper;

class EloquentMilestoneRepository implements MilestoneRepository
{
    public function list(string $projectUuid, int $userId): iterable
    {
        $project = $this->findProjectAccessible($projectUuid, $userId);

        return $project->milestones()
            ->orderBy('date_year')
            ->orderBy('date_month')
            ->orderBy('date_week')
            ->get()
            ->map(fn ($m) => MilestoneMapper::toModel($m))
            ->all();
    }

    public function create(string $projectUuid, int $userId, array $data): MilestoneModel
    {
        $project = $this->findProjectAccessible($projectUuid, $userId);
        $milestone = $project->milestones()->create($data);

        return MilestoneMapper::toModel($milestone);
    }

    public function find(string $projectUuid, string $milestoneUuid, int $userId): MilestoneModel
    {
        $milestone = $this->findMilestoneInProject($projectUuid, $milestoneUuid, $userId);

        return MilestoneMapper::toModel($milestone);
    }

    public function update(string $projectUuid, string $milestoneUuid, int $userId, array $data): MilestoneModel
    {
        $milestone = $this->findMilestoneInProject($projectUuid, $milestoneUuid, $userId);
        $milestone->update($data);

        return MilestoneMapper::toModel($milestone->fresh());
    }

    public function delete(string $projectUuid, string $milestoneUuid, int $userId): void
    {
        $milestone = $this->findMilestoneInProject($projectUuid, $milestoneUuid, $userId);
        $milestone->delete();
    }

    private function findProjectAccessible(string $projectUuid, int $userId): Project
    {
        return Project::query()
            ->where('uuid', $projectUuid)
            ->where(function ($q) use ($userId) {
                $q->where('owner_id', $userId)
                    ->orWhereHas('members', fn ($members) => $members->where('user_id', $userId));
            })
            ->firstOrFail();
    }

    private function findMilestoneInProject(string $projectUuid, string $milestoneUuid, int $userId): Milestone
    {
        $project = $this->findProjectAccessible($projectUuid, $userId);

        return $project->milestones()
            ->where('uuid', $milestoneUuid)
            ->firstOrFail();
    }
}
