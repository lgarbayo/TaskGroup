<?php

namespace App\Business\Project\Facade;

use App\Business\Project\Model\MilestoneModel;
use App\Business\Project\Model\ProjectModel;
use App\Business\Project\Model\TaskModel;
use App\Business\Project\Service\MilestoneService;
use App\Business\Project\Service\ProjectService;
use App\Business\Project\Service\TaskService;

class ProjectFacadeImpl implements ProjectFacade
{
    public function __construct(
        private ProjectService $projects,
        private TaskService $tasks,
        private MilestoneService $milestones,
    ) {
    }

    public function listProjects(int $userId): iterable
    {
        return $this->projects->listForUser($userId);
    }

    public function createProject(int $ownerId, array $data): ProjectModel
    {
        return $this->projects->create($ownerId, $data);
    }

    public function getProject(string $projectUuid, int $userId, bool $withRelations = false): ProjectModel
    {
        return $this->projects->findForUser($projectUuid, $userId, withRelations: $withRelations);
    }

    public function updateProject(string $projectUuid, int $userId, array $data): ProjectModel
    {
        return $this->projects->update($projectUuid, $userId, $data);
    }

    public function deleteProject(string $projectUuid, int $userId): void
    {
        $this->projects->delete($projectUuid, $userId);
    }

    public function listTasks(string $projectUuid, int $userId): iterable
    {
        return $this->tasks->list($projectUuid, $userId);
    }

    public function createTask(string $projectUuid, int $userId, array $data): TaskModel
    {
        return $this->tasks->create($projectUuid, $userId, $data);
    }

    public function getTask(string $projectUuid, string $taskUuid, int $userId): TaskModel
    {
        return $this->tasks->find($projectUuid, $taskUuid, $userId);
    }

    public function updateTask(string $projectUuid, string $taskUuid, int $userId, array $data): TaskModel
    {
        return $this->tasks->update($projectUuid, $taskUuid, $userId, $data);
    }

    public function deleteTask(string $projectUuid, string $taskUuid, int $userId): void
    {
        $this->tasks->delete($projectUuid, $taskUuid, $userId);
    }

    public function listMilestones(string $projectUuid, int $userId): iterable
    {
        return $this->milestones->list($projectUuid, $userId);
    }

    public function createMilestone(string $projectUuid, int $userId, array $data): MilestoneModel
    {
        return $this->milestones->create($projectUuid, $userId, $data);
    }

    public function getMilestone(string $projectUuid, string $milestoneUuid, int $userId): MilestoneModel
    {
        return $this->milestones->find($projectUuid, $milestoneUuid, $userId);
    }

    public function updateMilestone(string $projectUuid, string $milestoneUuid, int $userId, array $data): MilestoneModel
    {
        return $this->milestones->update($projectUuid, $milestoneUuid, $userId, $data);
    }

    public function deleteMilestone(string $projectUuid, string $milestoneUuid, int $userId): void
    {
        $this->milestones->delete($projectUuid, $milestoneUuid, $userId);
    }

    public function projectSummary(string $projectUuid, int $userId): array
    {
        $project = $this->projects->findForUser($projectUuid, $userId, withRelations: true);
        $tasks = $project->tasks ?? [];
        $total = count($tasks);
        $done = collect($tasks)->filter(fn ($t) => $t->status === 'done')->count();
        $pending = $total - $done;
        $progress = $total > 0 ? round(($done / $total) * 100, 2) : 0;

        return [
            'project' => $project,
            'totals' => [
                'total' => $total,
                'done' => $done,
                'pending' => $pending,
                'progress' => $progress,
            ],
            'milestones' => $project->milestones ?? [],
            'tasks' => $tasks,
        ];
    }
}
