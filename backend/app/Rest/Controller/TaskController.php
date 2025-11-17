<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Task\UpsertTaskRequest;
use App\Rest\Response\TaskResource;
use App\Business\Project\Service\TaskService;
use App\Business\Project\Service\ProjectService;
use App\Persistence\Project\Entity\Task;
use App\Persistence\Project\Entity\Project;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TaskController extends Controller
{

    public function __construct(private ProjectService $projects, private TaskService $tasks)
    {
    }

    public function index(Request $request, string $project)
    {
        $projectModel = $this->projects->findForUser($project, $request->user()->id);
        $tasks = $this->tasks->list($projectModel);

        return TaskResource::collection($tasks);
    }

    public function store(UpsertTaskRequest $request, string $project)
    {
        $user = $request->user();
        $project = $this->projects->findForUser($project, $user->id);
        $data = $request->validated();

        $assigneeId = $data['assignee_id'] ?? $user->id;
        $this->ensureUserBelongsToProject($project, $assigneeId);

        $task = $this->tasks->create($project, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'start_year' => $data['start_date']['year'],
            'start_month' => $data['start_date']['month'],
            'start_week' => $data['start_date']['week'],
            'duration_weeks' => $data['duration_weeks'],
            'status' => $data['status'] ?? 'pending',
            'assignee_id' => $assigneeId,
        ]);

        return (new TaskResource($task->load('assignee')))->response()->setStatusCode(201);
    }

    public function show(Request $request, string $project, Task $task)
    {
        $projectModel = $this->projects->findForUser($project, $request->user()->id);

        if ($task->project_id !== $projectModel->id) {
            abort(404);
        }

        return new TaskResource($task->load('assignee', 'project'));
    }

    public function update(UpsertTaskRequest $request, string $project, Task $task)
    {
        $user = $request->user();
        $project = $this->projects->findForUser($project, $user->id);

        if ($task->project_id !== $project->id) {
            abort(404);
        }

        $data = $request->validated();
        $assigneeId = $data['assignee_id'] ?? $task->assignee_id;

        if ($assigneeId) {
            $this->ensureUserBelongsToProject($project, $assigneeId);
        }

        $updated = $this->tasks->update($task, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'start_year' => $data['start_date']['year'],
            'start_month' => $data['start_date']['month'],
            'start_week' => $data['start_date']['week'],
            'duration_weeks' => $data['duration_weeks'],
            'status' => $data['status'] ?? $task->status,
            'assignee_id' => $assigneeId,
        ]);

        return new TaskResource($updated);
    }

    public function destroy(Request $request, string $project, Task $task)
    {
        $user = $request->user();
        $project = $this->projects->findForUser($project, $user->id);

        if ($task->project_id !== $project->id) {
            abort(404);
        }

        $task->delete();

        return response()->noContent();
    }

    protected function ensureUserBelongsToProject(Project $project, int $userId): void
    {
        $isMember = $project->owner_id === $userId || $project->members()->where('user_id', $userId)->exists();

        if (! $isMember) {
            throw new HttpException(422, 'El usuario asignado no pertenece al proyecto.');
        }
    }
}
