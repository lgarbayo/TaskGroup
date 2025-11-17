<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Project\UpsertProjectRequest;
use App\Rest\Response\ProjectResource;
use App\Business\Project\Service\ProjectService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(private ProjectService $projects)
    {
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $projects = $this->projects->listForUser($user->id);

        return ProjectResource::collection($projects);
    }

    public function store(UpsertProjectRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        $project = $this->projects->create($user->id, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'start_year' => $data['start_date']['year'],
            'start_month' => $data['start_date']['month'],
            'start_week' => $data['start_date']['week'],
            'end_year' => $data['end_date']['year'],
            'end_month' => $data['end_date']['month'],
            'end_week' => $data['end_date']['week'],
            'additional_fields' => $data['additional_fields'] ?? null,
        ]);

        return (new ProjectResource($project))->response()->setStatusCode(201);
    }

    public function show(Request $request, string $project)
    {
        $project = $this->projects->findForUser($project, $request->user()->id)
            ->load([
                'owner',
                'members',
                'tasks.assignee',
                'milestones',
            ])
            ->loadCount('tasks');

        return new ProjectResource($project);
    }

    public function update(UpsertProjectRequest $request, string $project)
    {
        $project = $this->projects->findForUser($project, $request->user()->id, ownerOnly: true);
        $data = $request->validated();

        $updated = $this->projects->update($project, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'start_year' => $data['start_date']['year'],
            'start_month' => $data['start_date']['month'],
            'start_week' => $data['start_date']['week'],
            'end_year' => $data['end_date']['year'],
            'end_month' => $data['end_date']['month'],
            'end_week' => $data['end_date']['week'],
            'additional_fields' => $data['additional_fields'] ?? null,
        ]);

        return new ProjectResource($updated->loadCount('tasks'));
    }

    public function destroy(Request $request, string $project)
    {
        $project = $this->projects->findForUser($project, $request->user()->id, ownerOnly: true);
        $this->projects->delete($project);

        return response()->noContent();
    }
}
