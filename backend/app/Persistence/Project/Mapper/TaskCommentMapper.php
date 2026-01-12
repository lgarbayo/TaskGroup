<?php

namespace App\Persistence\Project\Mapper;

use App\Business\Project\Model\TaskCommentModel;
use App\Persistence\Project\Entity\TaskComment;

class TaskCommentMapper
{
    public static function toModel(TaskComment $comment): TaskCommentModel
    {
        return new TaskCommentModel(
            id: $comment->id,
            taskUuid: $comment->task->uuid,
            author: [
                'id' => $comment->author->id,
                'alias' => $comment->author->alias,
                'email' => $comment->author->email,
            ],
            body: $comment->body,
            createdAt: $comment->created_at->toIso8601String(),
            updatedAt: $comment->updated_at->toIso8601String(),
        );
    }
}
