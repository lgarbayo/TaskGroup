<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Task\UpsertTaskRequest;
use App\Rest\Response\TaskResource;
use App\Business\Facade\ProjectFacade;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\Response;

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

        $assigneeIds = $this->resolveAssigneeIds($data, [$user->id]);
        $this->ensureUsersBelongToProject($projectModel, $assigneeIds);
        $milestoneUuid = $data['milestone_uuid'] ?? null;

        if ($milestoneUuid) {
            $this->ensureMilestoneBelongsToProject($projectModel, $milestoneUuid);
        }

        $task = $this->facade->createTask($project, $user->id, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'start_year' => $data['start_date']['year'],
            'start_month' => $data['start_date']['month'],
            'start_week' => $data['start_date']['week'],
            'duration_weeks' => $data['duration_weeks'],
            'status' => $data['status'] ?? 'pending',
            'priority' => $data['priority'] ?? 'medium',
            'assignee_id' => $assigneeIds[0] ?? null,
            'assignee_ids' => $assigneeIds,
            'milestone_uuid' => $milestoneUuid,
        ]);

        return (new TaskResource($task))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
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
        $assigneeIds = $this->resolveAssigneeIds(
            $data,
            $taskModel->assignees !== [] ? array_column($taskModel->assignees, 'id') : []
        );
        $milestoneUuid = array_key_exists('milestone_uuid', $data)
            ? $data['milestone_uuid']
            : ($taskModel->milestone['uuid'] ?? null);

        $this->ensureUsersBelongToProject($projectModel, $assigneeIds);

        if ($milestoneUuid) {
            $this->ensureMilestoneBelongsToProject($projectModel, $milestoneUuid);
        }

        $updated = $this->facade->updateTask($project, $task, $user->id, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'start_year' => $data['start_date']['year'],
            'start_month' => $data['start_date']['month'],
            'start_week' => $data['start_date']['week'],
            'duration_weeks' => $data['duration_weeks'],
            'status' => $data['status'] ?? $taskModel->status,
            'priority' => $data['priority'] ?? $taskModel->priority,
            'assignee_id' => $assigneeIds[0] ?? null,
            'assignee_ids' => $assigneeIds,
            'milestone_uuid' => $milestoneUuid,
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

    protected function ensureUsersBelongToProject($projectModel, array $userIds): void
    {
        $userIds = array_values(array_unique(array_filter($userIds, fn ($id) => $id !== null)));
        if ($userIds === []) {
            return;
        }
        $members = collect($projectModel->members)->pluck('id')->all();
        foreach ($userIds as $userId) {
            $isMember = $projectModel->ownerId === $userId || in_array($userId, $members, true);
            if (! $isMember) {
                throw new HttpException(422, 'El usuario asignado no pertenece al proyecto.');
            }
        }
    }

    protected function resolveAssigneeIds(array $data, array $fallback): array
    {
        if (array_key_exists('assignee_ids', $data)) {
            return array_values(array_filter($data['assignee_ids'] ?? [], fn ($id) => $id !== null));
        }

        if (array_key_exists('assignee_id', $data) && $data['assignee_id'] !== null) {
            return [$data['assignee_id']];
        }

        return $fallback;
    }

    protected function ensureMilestoneBelongsToProject($projectModel, string $milestoneUuid): void
    {
        $exists = collect($projectModel->milestones)->firstWhere('uuid', $milestoneUuid);

        if (! $exists) {
            throw new HttpException(422, 'El hito seleccionado no pertenece al proyecto.');
        }
    }
}
