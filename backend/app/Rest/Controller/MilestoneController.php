<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Command\Milestone\UpsertMilestoneRequest;
use App\Rest\Response\MilestoneResource;
use App\Business\Project\Service\ProjectService;
use App\Business\Project\Service\MilestoneService;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{

    public function __construct(private ProjectService $projects, private MilestoneService $milestones)
    {
    }

    public function index(Request $request, string $projectUuid)
    {
        $this->projects->findForUser($projectUuid, $request->user()->id);
        $milestones = $this->milestones->list($projectUuid, $request->user()->id);

        return MilestoneResource::collection($milestones);
    }

    public function store(UpsertMilestoneRequest $request, string $projectUuid)
    {
        $this->projects->findForUser($projectUuid, $request->user()->id);
        $data = $request->validated();

        $milestone = $this->milestones->create($projectUuid, $request->user()->id, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'date_year' => $data['date']['year'],
            'date_month' => $data['date']['month'],
            'date_week' => $data['date']['week'],
        ]);

        return (new MilestoneResource($milestone))->response()->setStatusCode(201);
    }

    public function show(Request $request, string $projectUuid, string $milestone)
    {
        $this->projects->findForUser($projectUuid, $request->user()->id);
        $milestoneModel = $this->milestones->find($projectUuid, $milestone, $request->user()->id);

        return new MilestoneResource($milestoneModel);
    }

    public function update(UpsertMilestoneRequest $request, string $projectUuid, string $milestone)
    {
        $this->projects->findForUser($projectUuid, $request->user()->id);

        $data = $request->validated();

        $updated = $this->milestones->update($projectUuid, $milestone, $request->user()->id, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'date_year' => $data['date']['year'],
            'date_month' => $data['date']['month'],
            'date_week' => $data['date']['week'],
        ]);

        return new MilestoneResource($updated);
    }

    public function destroy(Request $request, string $projectUuid, string $milestone)
    {
        $this->projects->findForUser($projectUuid, $request->user()->id);
        $this->milestones->delete($projectUuid, $milestone, $request->user()->id);

        return response()->noContent();
    }
}
