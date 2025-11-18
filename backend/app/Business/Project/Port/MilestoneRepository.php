<?php

namespace App\Business\Project\Port;

use App\Business\Project\Model\MilestoneModel;

interface MilestoneRepository
{
    public function list(string $projectUuid, int $userId): iterable;

    public function create(string $projectUuid, int $userId, array $data): MilestoneModel;

    public function find(string $projectUuid, string $milestoneUuid, int $userId): MilestoneModel;

    public function update(string $projectUuid, string $milestoneUuid, int $userId, array $data): MilestoneModel;

    public function delete(string $projectUuid, string $milestoneUuid, int $userId): void;
}
