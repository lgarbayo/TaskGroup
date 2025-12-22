<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Auth\LoginRequest;
use App\Rest\Command\Auth\RegisterRequest;
use App\Rest\Command\Auth\UpdateProfileRequest;
use App\Rest\Command\Auth\UploadAvatarRequest;
use App\Business\User\Service\UserService;
use App\Persistence\User\Mapper\UserMapper;
use App\Persistence\Project\Entity\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private UserService $users)
    {
    }

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $userModel = $this->users->create([
            'alias' => $data['alias'],
            'name' => $data['name'] ?? null,
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Necesitamos el usuario Eloquent para generar el token
        $userEntity = $this->users->findEntityByEmail($userModel->email);
        $token = $userEntity?->createToken('api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $userModel,
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        $userEntity = $this->users->findEntityByEmail($data['email']);

        if (! $userEntity || ! Hash::check($data['password'], $userEntity->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales inválidas.'],
            ]);
        }

        $token = $userEntity->createToken('api')->plainTextToken;
        $userModel = UserMapper::toModel($userEntity);

        return response()->json([
            'token' => $token,
            'user' => $userModel,
        ]);
    }

    public function me(Request $request)
    {
        $userModel = UserMapper::toModel($request->user());

        return response()->json($userModel);
    }

    public function update(UpdateProfileRequest $request)
    {
        $data = $request->validated();
        $userEntity = $request->user();

        $userEntity->fill([
            'alias' => $data['alias'],
            'name' => $data['name'] ?? null,
            'avatar_url' => $data['avatar_url'] ?? $userEntity->avatar_url,
        ]);
        $userEntity->save();

        $userModel = UserMapper::toModel($userEntity);

        return response()->json($userModel);
    }

    public function uploadAvatar(UploadAvatarRequest $request)
    {
        $userEntity = $request->user();
        $file = $request->file('avatar');

        $path = $file->store('avatars', 'public');
        $userEntity->avatar_url = Storage::disk('public')->url($path);
        $userEntity->save();

        $userModel = UserMapper::toModel($userEntity);

        return response()->json($userModel);
    }

    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->noContent();
    }

    public function stats(Request $request)
    {
        $user = $request->user();

        $from = now()->subDays(30);

        $assigned = Task::query()
            ->where('assignee_id', $user->id)
            ->where('created_at', '>=', $from)
            ->count();

        $done = Task::query()
            ->where('assignee_id', $user->id)
            ->where('created_at', '>=', $from)
            ->where('status', 'done')
            ->count();

        $pending = $assigned - $done;
        $completion = $assigned > 0 ? round(($done / $assigned) * 100, 2) : 0.0;

        return response()->json([
            'assigned' => $assigned,
            'done' => $done,
            'pending' => $pending,
            'completion' => $completion,
        ]);
    }
}
