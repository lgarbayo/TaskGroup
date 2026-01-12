<?php

namespace App\Business\Project\Model;

class TaskCommentModel
{
    public function __construct(
        public readonly int $id,
        public readonly string $taskUuid,
        public readonly array $author,
        public readonly string $body,
        public readonly string $createdAt,
        public readonly string $updatedAt,
    ) {
    }
}
