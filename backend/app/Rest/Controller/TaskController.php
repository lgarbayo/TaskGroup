<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Task\UpsertTaskRequest;
use App\Rest\Response\TaskResource;
use App\Business\Facade\ProjectFacade;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TaskController extends Controller
{

    public function __construct(private ProjectFacade $facade)
    {
    }

    public function index(Request $request, string $project)
    {
        $this->facade->getProject($project, $request->user()->id);
        $tasks = $this->facade->listTasks($project, $request->user()->id);

        return TaskResource::collection($tasks);
    }

    public function store(UpsertTaskRequest $request, string $project)
    {
        $user = $request->user();
        $projectModel = $this->facade->getProject($project, $user->id, withRelations: true);
        $data = $request->validated();

        $assigneeId = $data['assignee_id'] ?? $user->id;
        $this->ensureUserBelongsToProject($projectModel, $assigneeId);

        $task = $this->facade->createTask($project, $user->id, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'start_year' => $data['start_date']['year'],
            'start_month' => $data['start_date']['month'],
            'start_week' => $data['start_date']['week'],
            'duration_weeks' => $data['duration_weeks'],
            'status' => $data['status'] ?? 'pending',
            'assignee_id' => $assigneeId,
        ]);

        return redirect()->to("/api/projects/{$project}/tasks/{$task->uuid}")->setStatusCode(303);
    }

    public function show(Request $request, string $project, string $task)
    {
        $this->facade->getProject($project, $request->user()->id);
        $taskModel = $this->facade->getTask($project, $task, $request->user()->id);

        return new TaskResource($taskModel);
    }

    public function update(UpsertTaskRequest $request, string $project, string $task)
    {
        $user = $request->user();
        $projectModel = $this->facade->getProject($project, $user->id, withRelations: true);

        $data = $request->validated();
        $taskModel = $this->facade->getTask($project, $task, $user->id);
        $assigneeId = $data['assignee_id'] ?? ($taskModel->assignee['id'] ?? null);

        if ($assigneeId) {
            $this->ensureUserBelongsToProject($projectModel, $assigneeId);
        }

        $updated = $this->facade->updateTask($project, $task, $user->id, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'start_year' => $data['start_date']['year'],
            'start_month' => $data['start_date']['month'],
            'start_week' => $data['start_date']['week'],
            'duration_weeks' => $data['duration_weeks'],
            'status' => $data['status'] ?? $taskModel->status,
            'assignee_id' => $assigneeId,
        ]);

        return new TaskResource($updated);
    }

    public function destroy(Request $request, string $project, string $task)
    {
        $user = $request->user();
        $this->facade->getProject($project, $user->id);
        $this->facade->deleteTask($project, $task, $user->id);

        return response()->noContent();
    }

    protected function ensureUserBelongsToProject($projectModel, int $userId): void
    {
        $isMember = $projectModel->ownerId === $userId || collect($projectModel->members)->firstWhere('id', $userId);

        if (! $isMember) {
            throw new HttpException(422, 'El usuario asignado no pertenece al proyecto.');
        }
    }
}
