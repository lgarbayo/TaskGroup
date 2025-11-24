<?php

namespace App\Business\Facade;

use App\Business\Analysis\Model\ProjectAnalysisModel;
use App\Business\Project\Model\ProjectModel;
use App\Business\Project\Model\TaskModel;
use App\Business\Project\Model\MilestoneModel;

interface ProjectFacade
{
    /** projects */
    public function listProjects(int $userId): iterable;
    public function createProject(int $ownerId, array $data): ProjectModel;
    public function getProject(string $projectUuid, int $userId, bool $withRelations = false): ProjectModel;
    public function updateProject(string $projectUuid, int $userId, array $data): ProjectModel;
    public function deleteProject(string $projectUuid, int $userId): void;

    /** tasks */
    public function listTasks(string $projectUuid, int $userId): iterable;
    public function createTask(string $projectUuid, int $userId, array $data): TaskModel;
    public function getTask(string $projectUuid, string $taskUuid, int $userId): TaskModel;
    public function updateTask(string $projectUuid, string $taskUuid, int $userId, array $data): TaskModel;
    public function deleteTask(string $projectUuid, string $taskUuid, int $userId): void;

    /** milestones */
    public function listMilestones(string $projectUuid, int $userId): iterable;
    public function createMilestone(string $projectUuid, int $userId, array $data): MilestoneModel;
    public function getMilestone(string $projectUuid, string $milestoneUuid, int $userId): MilestoneModel;
    public function updateMilestone(string $projectUuid, string $milestoneUuid, int $userId, array $data): MilestoneModel;
    public function deleteMilestone(string $projectUuid, string $milestoneUuid, int $userId): void;

    /** summary */
    public function projectSummary(string $projectUuid, int $userId): array;

    /** analysis */
    public function projectAnalysis(string $projectUuid, int $userId): ProjectAnalysisModel;
}
