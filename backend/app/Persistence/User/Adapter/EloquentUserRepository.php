<?php

namespace App\Persistence\User\Adapter;

use App\Business\User\Model\UserModel;
use App\Business\User\Port\UserRepository;
use App\Persistence\User\Entity\User;
use App\Persistence\User\Mapper\UserMapper;

class EloquentUserRepository implements UserRepository
{
    public function create(array $data): UserModel
    {
        $user = User::create($data);

        return UserMapper::toModel($user);
    }

    public function findById(int $id): ?UserModel
    {
        $user = User::find($id);

        return $user ? UserMapper::toModel($user) : null;
    }

    public function findByEmail(string $email): ?UserModel
    {
        $user = User::where('email', $email)->first();

        return $user ? UserMapper::toModel($user) : null;
    }

    public function findEntityByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
