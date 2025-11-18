<?php

namespace App\Business\Project\Service;

use App\Business\Project\Port\MilestoneRepository;
use App\Business\Project\Model\MilestoneModel;

class MilestoneService
{
    public function __construct(private MilestoneRepository $milestones)
    {
    }

    public function list(string $projectUuid, int $userId): iterable
    {
        return $this->milestones->list($projectUuid, $userId);
    }

    public function create(string $projectUuid, int $userId, array $data): MilestoneModel
    {
        return $this->milestones->create($projectUuid, $userId, $data);
    }

    public function find(string $projectUuid, string $milestoneUuid, int $userId): MilestoneModel
    {
        return $this->milestones->find($projectUuid, $milestoneUuid, $userId);
    }

    public function update(string $projectUuid, string $milestoneUuid, int $userId, array $data): MilestoneModel
    {
        return $this->milestones->update($projectUuid, $milestoneUuid, $userId, $data);
    }

    public function delete(string $projectUuid, string $milestoneUuid, int $userId): void
    {
        $this->milestones->delete($projectUuid, $milestoneUuid, $userId);
    }
}
