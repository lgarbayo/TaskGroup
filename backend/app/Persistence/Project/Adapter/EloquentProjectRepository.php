<?php

namespace App\Persistence\Project\Adapter;

use App\Business\Project\Model\ProjectModel;
use App\Business\Project\Port\ProjectRepository;
use App\Persistence\Project\Entity\Project;
use App\Persistence\Project\Mapper\ProjectMapper;
use Illuminate\Database\Eloquent\Builder;

class EloquentProjectRepository implements ProjectRepository
{
    public function listForUser(int $userId): iterable
    {
        return Project::query()
            ->withCount('tasks')
            ->where('owner_id', $userId)
            ->orWhereHas('members', fn (Builder $members) => $members->where('user_id', $userId))
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(fn ($project) => ProjectMapper::toModel($project))
            ->all();
    }

    public function create(int $ownerId, array $data): ProjectModel
    {
        $project = Project::create(array_merge($data, ['owner_id' => $ownerId]));
        $project->members()->attach($ownerId, ['role' => 'owner']);

        return ProjectMapper::toModel($project);
    }

    public function findForUser(string $uuid, int $userId, bool $ownerOnly = false, bool $withRelations = false): ProjectModel
    {
        $query = Project::query()->where('uuid', $uuid);

        if ($ownerOnly) {
            $query->where('owner_id', $userId);
        } else {
            $query->where(function ($builder) use ($userId) {
                $builder
                    ->where('owner_id', $userId)
                    ->orWhereHas('members', fn ($members) => $members->where('user_id', $userId));
            });
        }

        $project = $query->firstOrFail();

        if ($withRelations) {
            $project->load(['owner', 'members', 'tasks.assignee', 'milestones']);
        }

        return ProjectMapper::toModel($project, withRelations: $withRelations);
    }

    public function update(string $projectUuid, int $userId, array $data): ProjectModel
    {
        $project = $this->loadOwnedProject($projectUuid, $userId);
        $project->update($data);

        return ProjectMapper::toModel($project->fresh());
    }

    public function delete(string $projectUuid, int $userId): void
    {
        $project = $this->loadOwnedProject($projectUuid, $userId);
        $project->delete();
    }

    private function loadOwnedProject(string $uuid, int $userId): Project
    {
        return Project::query()
            ->where('uuid', $uuid)
            ->where('owner_id', $userId)
            ->firstOrFail();
    }
}
