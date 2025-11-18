<?php

namespace App\Business\User\Service;

use App\Business\User\Port\UserRepository;
use App\Business\User\Model\UserModel;
use App\Persistence\User\Entity\User;

class UserService
{
    public function __construct(private UserRepository $users)
    {
    }

    public function create(array $data): UserModel
    {
        return $this->users->create($data);
    }

    public function findById(int $id): ?UserModel
    {
        return $this->users->findById($id);
    }

    public function findByEmail(string $email): ?UserModel
    {
        return $this->users->findByEmail($email);
    }

    public function findEntityByEmail(string $email): ?User
    {
        return $this->users->findEntityByEmail($email);
    }
}
