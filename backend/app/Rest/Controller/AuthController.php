<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Auth\LoginRequest;
use App\Rest\Command\Auth\RegisterRequest;
use App\Business\User\Service\UserService;
use App\Persistence\User\Mapper\UserMapper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->noContent();
    }
}
