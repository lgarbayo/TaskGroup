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
        $project = $this->projects->findForUser($projectId, $request->user()->id);

        $total = $project->tasks()->count();
        $done = $project->tasks()->where('status', 'done')->count();
        $pending = $total - $done;
        $progress = $total > 0 ? round(($done / $total) * 100, 2) : 0;

        $milestones = $project->milestones;
        $tasks = $project->tasks;

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
