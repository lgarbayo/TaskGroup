<?php

namespace App\Business\Project\Service;

use App\Business\Project\Port\ProjectRepository;
use App\Business\Project\Model\ProjectModel;

class ProjectService
{
    public function __construct(private ProjectRepository $projects)
    {
    }

    public function listForUser(int $userId): iterable
    {
        return $this->projects->listForUser($userId);
    }

    public function create(int $ownerId, array $data): ProjectModel
    {
        return $this->projects->create($ownerId, $data);
    }

    public function findForUser(string $uuid, int $userId, bool $ownerOnly = false, bool $withRelations = false): ProjectModel
    {
        return $this->projects->findForUser($uuid, $userId, $ownerOnly, $withRelations);
    }

    public function update(string $projectUuid, int $userId, array $data): ProjectModel
    {
        return $this->projects->update($projectUuid, $userId, $data);
    }

    public function delete(string $projectUuid, int $userId): void
    {
        $this->projects->delete($projectUuid, $userId);
    }

    public function inviteMember(string $projectUuid, int $ownerId, string $email, ?string $role = null): ProjectModel
    {
        return $this->projects->inviteMember($projectUuid, $ownerId, $email, $role);
    }

    public function acceptInvitation(string $token, int $userId): ProjectModel
    {
        return $this->projects->acceptInvitation($token, $userId);
    }

    public function cancelInvitation(string $projectUuid, int $ownerId, int $invitationId): ProjectModel
    {
        return $this->projects->cancelInvitation($projectUuid, $ownerId, $invitationId);
    }

    public function removeMember(string $projectUuid, int $ownerId, int $memberId): ProjectModel
    {
        return $this->projects->removeMember($projectUuid, $ownerId, $memberId);
    }
}
