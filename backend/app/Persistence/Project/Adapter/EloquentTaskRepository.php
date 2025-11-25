<?php

namespace App\Persistence\Project\Adapter;

use App\Business\Project\Model\TaskModel;
use App\Business\Project\Port\TaskRepository;
use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Entity\Task;
use App\Persistence\Project\Mapper\TaskMapper;

class EloquentTaskRepository implements TaskRepository
{
    public function list(string $projectUuid, int $userId): iterable
    {
        $project = $this->findProjectAccessible($projectUuid, $userId);

        return $project->tasks()->with(['assignee', 'project', 'milestone'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($task) => TaskMapper::toModel($task))
            ->all();
    }

    public function create(string $projectUuid, int $userId, array $data): TaskModel
    {
        $project = $this->findProjectAccessible($projectUuid, $userId);
        $task = $project->tasks()->create($data)->load('assignee', 'project', 'milestone');

        return TaskMapper::toModel($task);
    }

    public function find(string $projectUuid, string $taskUuid, int $userId): TaskModel
    {
        $task = $this->findTaskInProject($projectUuid, $taskUuid, $userId);

        return TaskMapper::toModel($task->load('assignee', 'project', 'milestone'));
    }

    public function update(string $projectUuid, string $taskUuid, int $userId, array $data): TaskModel
    {
        $task = $this->findTaskInProject($projectUuid, $taskUuid, $userId);
        $task->update($data);

        return TaskMapper::toModel($task->fresh()->load('assignee', 'project', 'milestone'));
    }

    public function delete(string $projectUuid, string $taskUuid, int $userId): void
    {
        $task = $this->findTaskInProject($projectUuid, $taskUuid, $userId);
        $task->delete();
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
}
