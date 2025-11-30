<?php

namespace App\Business\Project\Port;

use App\Business\Project\Model\ProjectModel;

interface ProjectRepository
{
    public function listForUser(int $userId): iterable;

    public function create(int $ownerId, array $data): ProjectModel;

    public function findForUser(string $uuid, int $userId, bool $ownerOnly = false, bool $withRelations = false): ProjectModel;

    public function update(string $projectUuid, int $userId, array $data): ProjectModel;

    public function delete(string $projectUuid, int $userId): void;

    public function inviteMember(string $projectUuid, int $ownerId, string $email, ?string $role = null): ProjectModel;
    public function acceptInvitation(string $token, int $userId): ProjectModel;
    public function cancelInvitation(string $projectUuid, int $ownerId, int $invitationId): ProjectModel;
    public function removeMember(string $projectUuid, int $ownerId, int $memberId): ProjectModel;
}
