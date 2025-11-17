<?php

use App\Rest\Controller\AuthController;
use App\Rest\Controller\ProjectController;
use App\Rest\Controller\ProjectMemberController;
use App\Rest\Controller\ProjectSummaryController;
use App\Rest\Controller\TaskController;
use App\Rest\Controller\MilestoneController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

    Route::post('/projects/{project}/members', [ProjectMemberController::class, 'store']);
    Route::get('/projects/{project}/summary', [ProjectSummaryController::class, 'show']);

    Route::get('/projects/{project}/tasks', [TaskController::class, 'index']);
    Route::post('/projects/{project}/tasks', [TaskController::class, 'store']);
    Route::get('/projects/{project}/tasks/{task}', [TaskController::class, 'show']);
    Route::put('/projects/{project}/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/projects/{project}/tasks/{task}', [TaskController::class, 'destroy']);

    Route::get('/projects/{project}/milestone', [MilestoneController::class, 'index']);
    Route::post('/projects/{project}/milestone', [MilestoneController::class, 'store']);
    Route::get('/projects/{project}/milestone/{milestone}', [MilestoneController::class, 'show']);
    Route::put('/projects/{project}/milestone/{milestone}', [MilestoneController::class, 'update']);
    Route::delete('/projects/{project}/milestone/{milestone}', [MilestoneController::class, 'destroy']);
});
