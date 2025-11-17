<?php

namespace App\Persistence\Project\Adapter;

use App\Business\Project\Port\ProjectRepository;
use App\Persistence\Project\Entity\Project;
use Illuminate\Database\Eloquent\Builder;

class EloquentProjectRepository implements ProjectRepository
{
    public function listForUser(int $userId): iterable
    {
        return Project::query()
            ->withCount('tasks')
            ->where('owner_id', $userId)
            ->orWhereHas('members', fn (Builder $members) => $members->where('user_id', $userId))
            ->distinct()
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    public function create(array $data): Project
    {
        $project = Project::create($data);
        // attach owner as member if provided
        if (isset($data['owner_id'])) {
            $project->members()->attach($data['owner_id'], ['role' => 'owner']);
        }

        return $project;
    }

    public function findForUser(string $uuid, int $userId, bool $ownerOnly = false): Project
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

        return $query->firstOrFail();
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->fresh();
    }

    public function delete(Project $project): void
    {
        $project->delete();
    }
}
