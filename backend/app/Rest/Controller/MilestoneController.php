<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Milestone\UpsertMilestoneRequest;
use App\Rest\Response\MilestoneResource;
use App\Business\Project\Service\ProjectService;
use App\Business\Project\Service\MilestoneService;
use App\Persistence\Project\Entity\Milestone;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{

    public function __construct(private ProjectService $projects, private MilestoneService $milestones)
    {
    }

    public function index(Request $request, string $projectUuid)
    {
        $project = $this->projects->findForUser($projectUuid, $request->user()->id);
        $milestones = $this->milestones->list($project);

        return MilestoneResource::collection($milestones);
    }

    public function store(UpsertMilestoneRequest $request, string $projectUuid)
    {
        $project = $this->projects->findForUser($projectUuid, $request->user()->id);
        $data = $request->validated();

        $milestone = $this->milestones->create($project, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'date_year' => $data['date']['year'],
            'date_month' => $data['date']['month'],
            'date_week' => $data['date']['week'],
        ]);

        return (new MilestoneResource($milestone))->response()->setStatusCode(201);
    }

    public function show(Request $request, string $projectUuid, Milestone $milestone)
    {
        $this->projects->findForUser($projectUuid, $request->user()->id);

        if ($milestone->project->uuid !== $projectUuid) {
            abort(404);
        }

        return new MilestoneResource($milestone);
    }

    public function update(UpsertMilestoneRequest $request, string $projectUuid, Milestone $milestone)
    {
        $this->projects->findForUser($projectUuid, $request->user()->id);

        if ($milestone->project->uuid !== $projectUuid) {
            abort(404);
        }

        $data = $request->validated();

        $updated = $this->milestones->update($milestone, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'date_year' => $data['date']['year'],
            'date_month' => $data['date']['month'],
            'date_week' => $data['date']['week'],
        ]);

        return new MilestoneResource($updated);
    }

    public function destroy(Request $request, string $projectUuid, Milestone $milestone)
    {
        $this->projects->findForUser($projectUuid, $request->user()->id);

        if ($milestone->project->uuid !== $projectUuid) {
            abort(404);
        }

        $this->milestones->delete($milestone);

        return response()->noContent();
    }
}
