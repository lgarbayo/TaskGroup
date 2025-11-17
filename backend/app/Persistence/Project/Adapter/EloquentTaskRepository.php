<?php

namespace App\Persistence\Project\Adapter;

use App\Business\Project\Port\TaskRepository;
use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Entity\Task;

class EloquentTaskRepository implements TaskRepository
{
    public function list(Project $project): iterable
    {
        return $project->tasks()->with(['assignee', 'project'])->orderBy('created_at', 'desc')->get();
    }

    public function create(Project $project, array $data): Task
    {
        return $project->tasks()->create($data)->load('assignee', 'project');
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);

        return $task->fresh()->load('assignee', 'project');
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }
}
