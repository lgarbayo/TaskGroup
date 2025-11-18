<?php

namespace App\Business\Project\Service;

use App\Business\Project\Port\TaskRepository;
use App\Business\Project\Model\TaskModel;

class TaskService
{
    public function __construct(private TaskRepository $tasks)
    {
    }

    public function list(string $projectUuid, int $userId): iterable
    {
        return $this->tasks->list($projectUuid, $userId);
    }

    public function create(string $projectUuid, int $userId, array $data): TaskModel
    {
        return $this->tasks->create($projectUuid, $userId, $data);
    }

    public function find(string $projectUuid, string $taskUuid, int $userId): TaskModel
    {
        return $this->tasks->find($projectUuid, $taskUuid, $userId);
    }

    public function update(string $projectUuid, string $taskUuid, int $userId, array $data): TaskModel
    {
        return $this->tasks->update($projectUuid, $taskUuid, $userId, $data);
    }

    public function delete(string $projectUuid, string $taskUuid, int $userId): void
    {
        $this->tasks->delete($projectUuid, $taskUuid, $userId);
    }
}
