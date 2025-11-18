<?php

namespace App\Rest\Controller;

use App\Http\Controllers\Controller;
use App\Rest\Response\ProjectSummaryResource;
use App\Business\Project\Service\ProjectService;
use Illuminate\Http\Request;

class ProjectSummaryController extends Controller
{

    public function __construct(private ProjectService $projects)
    {
    }

    public function show(Request $request, string $projectId)
    {
        $project = $this->projects->findForUser($projectId, $request->user()->id, withRelations: true);

        $tasks = $project->tasks ?? [];
        $total = count($tasks);
        $done = collect($tasks)->filter(fn ($t) => $t->status === 'done')->count();
        $pending = $total - $done;
        $progress = $total > 0 ? round(($done / $total) * 100, 2) : 0;

        $milestones = $project->milestones ?? [];

        return new ProjectSummaryResource([
            'project' => $project,
            'totals' => [
                'total' => $total,
                'done' => $done,
                'pending' => $pending,
                'progress' => $progress,
            ],
            'milestones' => $milestones,
            'tasks' => $tasks,
        ]);
    }
}
