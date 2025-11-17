<?php

namespace App\Business\Project\Port;

use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Entity\Task;

interface TaskRepository
{
    public function list(Project $project): iterable;

    public function create(Project $project, array $data): Task;

    public function update(Task $task, array $data): Task;

    public function delete(Task $task): void;
}
