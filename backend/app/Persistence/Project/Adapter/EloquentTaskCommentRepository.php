<?php

namespace App\Persistence\Project\Adapter;

use App\Business\Project\Model\TaskCommentModel;
use App\Business\Project\Port\TaskCommentRepository;
use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Entity\Task;
use App\Persistence\Project\Entity\TaskComment;
use App\Persistence\Project\Mapper\TaskCommentMapper;
use Symfony\Component\HttpKernel\Exception\HttpException;

class EloquentTaskCommentRepository implements TaskCommentRepository
{
    public function list(string $projectUuid, string $taskUuid, int $userId): iterable
    {
        $task = $this->findTaskInProject($projectUuid, $taskUuid, $userId);

        return $task->comments()
            ->with(['author', 'task'])
            ->orderBy('created_at')
            ->get()
            ->map(fn (TaskComment $comment) => TaskCommentMapper::toModel($comment))
            ->all();
    }

    public function create(string $projectUuid, string $taskUuid, int $userId, array $data): TaskCommentModel
    {
        $task = $this->findTaskInProject($projectUuid, $taskUuid, $userId);
        $comment = $task->comments()->create([
            'user_id' => $userId,
            'body' => $data['body'],
        ]);
        $comment->load(['author', 'task']);

        return TaskCommentMapper::toModel($comment);
    }

    public function update(string $projectUuid, string $taskUuid, int $commentId, int $userId, array $data): TaskCommentModel
    {
        $comment = $this->findCommentInTask($projectUuid, $taskUuid, $commentId, $userId);
        $comment->update([
            'body' => $data['body'],
        ]);

        return TaskCommentMapper::toModel($comment->fresh()->load(['author', 'task']));
    }

    public function delete(string $projectUuid, string $taskUuid, int $commentId, int $userId): void
    {
        $comment = $this->findCommentInTask($projectUuid, $taskUuid, $commentId, $userId);
        $comment->delete();
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

    private function findTaskInProject(string $projectUuid, string $taskUuid, int $userId): Task
    {
        $project = $this->findProjectAccessible($projectUuid, $userId);

        return $project->tasks()
            ->where('uuid', $taskUuid)
            ->firstOrFail();
    }

    private function findCommentInTask(string $projectUuid, string $taskUuid, int $commentId, int $userId): TaskComment
    {
        $task = $this->findTaskInProject($projectUuid, $taskUuid, $userId);
        $comment = $task->comments()
            ->where('id', $commentId)
            ->firstOrFail();

        if ($comment->user_id !== $userId) {
            throw new HttpException(403, 'Solo el autor puede modificar o eliminar el comentario.');
        }

        return $comment;
    }
}
