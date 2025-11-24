<?php

namespace App\Providers;

use App\Business\Analysis\Port\AnalysisRepository;
use App\Business\Project\Port\MilestoneRepository;
use App\Business\Project\Port\ProjectRepository;
use App\Business\Project\Port\TaskRepository;
use App\Persistence\Analysis\Adapter\EloquentAnalysisRepository;
use App\Persistence\Project\Adapter\EloquentMilestoneRepository;
use App\Persistence\Project\Adapter\EloquentProjectRepository;
use App\Persistence\Project\Adapter\EloquentTaskRepository;
use App\Business\User\Port\UserRepository;
use App\Persistence\User\Adapter\EloquentUserRepository;
use App\Business\Facade\ProjectFacade;
use App\Business\Facade\ProjectFacadeImpl;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProjectRepository::class, EloquentProjectRepository::class);
        $this->app->bind(TaskRepository::class, EloquentTaskRepository::class);
        $this->app->bind(MilestoneRepository::class, EloquentMilestoneRepository::class);
        $this->app->bind(AnalysisRepository::class, EloquentAnalysisRepository::class);
        $this->app->bind(UserRepository::class, EloquentUserRepository::class);
        $this->app->bind(ProjectFacade::class, ProjectFacadeImpl::class);
    }
}
