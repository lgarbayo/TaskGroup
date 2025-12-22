<?php

namespace App\Business\User\Model;

class UserModel
{
    public function __construct(
        public readonly int $id,
        public readonly string $alias,
        public readonly string $email,
        public readonly ?string $name = null,
        public readonly bool $emailVerified = false,
        public readonly ?string $updatedAt = null,
        public readonly ?string $avatarUrl = null,
    ) {
    }
}
