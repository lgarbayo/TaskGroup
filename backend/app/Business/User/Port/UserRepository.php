<?php

namespace App\Business\User\Port;

use App\Business\User\Model\UserModel;
use App\Persistence\User\Entity\User;

interface UserRepository
{
    public function create(array $data): UserModel;

    public function findById(int $id): ?UserModel;

    public function findByEmail(string $email): ?UserModel;

    /**
     * Para autenticación (Sanctum necesita el Authenticatable)
     */
    public function findEntityByEmail(string $email): ?User;
}
