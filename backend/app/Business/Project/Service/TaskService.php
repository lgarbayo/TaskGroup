<?php

namespace App\Business\Project\Service;

use App\Business\Project\Port\TaskRepository;
use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Entity\Task;

class TaskService
{
    public function __construct(private TaskRepository $tasks)
    {
    }

    public function list(Project $project): iterable
    {
        return $this->tasks->list($project);
    }

    public function create(Project $project, array $data): Task
    {
        return $this->tasks->create($project, $data);
    }

    public function update(Task $task, array $data): Task
    {
        return $this->tasks->update($task, $data);
    }

    public function delete(Task $task): void
    {
        $this->tasks->delete($task);
    }
}
