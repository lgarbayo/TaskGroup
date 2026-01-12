<?php

namespace App\Business\Project\Service;

use App\Business\Project\Model\TaskCommentModel;
use App\Business\Project\Port\TaskCommentRepository;

class TaskCommentService
{
    public function __construct(private TaskCommentRepository $comments)
    {
    }

    public function list(string $projectUuid, string $taskUuid, int $userId): iterable
    {
        return $this->comments->list($projectUuid, $taskUuid, $userId);
    }

    public function create(string $projectUuid, string $taskUuid, int $userId, array $data): TaskCommentModel
    {
        return $this->comments->create($projectUuid, $taskUuid, $userId, $data);
    }

    public function update(string $projectUuid, string $taskUuid, int $commentId, int $userId, array $data): TaskCommentModel
    {
        return $this->comments->update($projectUuid, $taskUuid, $commentId, $userId, $data);
    }

    public function delete(string $projectUuid, string $taskUuid, int $commentId, int $userId): void
    {
        $this->comments->delete($projectUuid, $taskUuid, $commentId, $userId);
    }
}
