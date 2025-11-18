<?php

namespace App\Persistence\User\Mapper;

use App\Business\User\Model\UserModel;
use App\Persistence\User\Entity\User;

class UserMapper
{
    public static function toModel(User $user): UserModel
    {
        return new UserModel(
            id: $user->id,
            alias: $user->alias,
            email: $user->email,
            name: $user->name,
        );
    }
}
