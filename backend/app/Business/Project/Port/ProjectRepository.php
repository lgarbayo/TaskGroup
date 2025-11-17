<?php

namespace App\Business\Project\Port;

use App\Persistence\Project\Entity\Project;

interface ProjectRepository
{
    public function listForUser(int $userId): iterable;

    public function create(array $data): Project;

    public function findForUser(string $uuid, int $userId, bool $ownerOnly = false): Project;

    public function update(Project $project, array $data): Project;

    public function delete(Project $project): void;
}
