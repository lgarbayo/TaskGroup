<?php

namespace App\Business\Project\Port;

use App\Business\Project\Model\TaskCommentModel;

interface TaskCommentRepository
{
    public function list(string $projectUuid, string $taskUuid, int $userId): iterable;
    public function create(string $projectUuid, string $taskUuid, int $userId, array $data): TaskCommentModel;
    public function update(string $projectUuid, string $taskUuid, int $commentId, int $userId, array $data): TaskCommentModel;
    public function delete(string $projectUuid, string $taskUuid, int $commentId, int $userId): void;
}
