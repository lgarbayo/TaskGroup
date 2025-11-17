<?php

namespace App\Business\Project\Service;

use App\Business\Project\Port\ProjectRepository;
use App\Persistence\Project\Entity\Project;

class ProjectService
{
    public function __construct(private ProjectRepository $projects)
    {
    }

    public function listForUser(int $userId): iterable
    {
        return $this->projects->listForUser($userId);
    }

    public function create(int $ownerId, array $data): Project
    {
        $payload = array_merge($data, ['owner_id' => $ownerId]);

        return $this->projects->create($payload);
    }

    public function findForUser(string $uuid, int $userId, bool $ownerOnly = false): Project
    {
        return $this->projects->findForUser($uuid, $userId, $ownerOnly);
    }

    public function update(Project $project, array $data): Project
    {
        return $this->projects->update($project, $data);
    }

    public function delete(Project $project): void
    {
        $this->projects->delete($project);
    }
}
