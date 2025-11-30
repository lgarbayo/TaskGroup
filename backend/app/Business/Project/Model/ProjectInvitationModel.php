<?php

namespace App\Business\Project\Model;

class ProjectInvitationModel
{
    public function __construct(
        public readonly int $id,
        public readonly string $email,
        public readonly string $role,
        public readonly string $status,
        public readonly ?int $inviteeId,
        public readonly ?string $token = null,
    ) {
    }
}
