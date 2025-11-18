<?php

namespace App\Business\Project\Port;

use App\Business\Project\Model\TaskModel;

interface TaskRepository
{
    public function list(string $projectUuid, int $userId): iterable;

    public function create(string $projectUuid, int $userId, array $data): TaskModel;

    public function find(string $projectUuid, string $taskUuid, int $userId): TaskModel;

    public function update(string $projectUuid, string $taskUuid, int $userId, array $data): TaskModel;

    public function delete(string $projectUuid, string $taskUuid, int $userId): void;
}
