import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProjectService } from '../../service/project-service';
import { Project, UpsertProjectCommand } from '../../model/project.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { Milestone, UpsertMilestoneCommand } from '../../model/milestone.model';
import { Task, UpsertTaskCommand } from '../../model/task.model';
import { MilestoneService } from '../../service/milestone-service';
import { TaskService } from '../../service/task-service';
import { AnalysisService } from '../../service/analysis-service';
import { ProjectAnalysis } from '../../model/analysis.model';
import { ProjectForm } from "../../component/project/project-form/project-form";
import { MilestoneForm } from "../../component/project/milestone-form/milestone-form";
import { TaskForm } from "../../component/project/task-form/task-form";

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [
    DecimalPipe,
    KeyValuePipe,
    ProjectForm,
    MilestoneForm,
    TaskForm
],
  templateUrl: './project-detail-page.html',
  styleUrl: './project-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailPage {
  private activatedRoute = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private milestoneService = inject(MilestoneService);
  private taskService = inject(TaskService);
  private analysisService = inject(AnalysisService);

  @ViewChild('milestoneCreator') milestoneForm?: MilestoneForm;
  @ViewChild('taskCreator') taskForm?: TaskForm;

  private projectUuid = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(p => p.get('projectUuid'))
    )
  );

  project = signal<Project | undefined>(undefined);
  milestones = signal<Array<Milestone>>([]);
  tasks = signal<Array<Task>>([]);
  analysis = signal<ProjectAnalysis | undefined>(undefined);

  projectLoading = signal(false);
  projectError = signal<string | null>(null);
  milestoneLoading = signal(false);
  milestoneError = signal<string | null>(null);
  taskLoading = signal(false);
  taskError = signal<string | null>(null);
  analysisLoading = signal(false);
  analysisError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const projectUuid = this.projectUuid();
      if (projectUuid) {
        this.loadProject(projectUuid);
        this.loadMilestones(projectUuid);
        this.loadTasks(projectUuid);
        this.loadAnalysis(projectUuid);
      }
    });
  }

  update(data: UpsertProjectCommand): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) return;
    this.projectService.updateProject(projectUuid, data).subscribe({
      next: (updated) => {
        this.project.set(updated);
        this.projectError.set(null);
      },
      error: (error) => {
        console.error('Error updating project', error);
        this.projectError.set('We couldn\'t update the project.');
      },
    });
  }

  saveMilestone(command: UpsertMilestoneCommand): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.milestoneLoading.set(true);
    this.milestoneService.create(projectUuid, command).subscribe({
      next: () => {
        this.milestoneForm?.resetForm();
        this.loadMilestones(projectUuid);
      },
      error: (error) => {
        console.error('Error creating milestone', error);
        this.milestoneError.set('We couldn\'t create the milestone.');
        this.milestoneLoading.set(false);
      },
    });
  }

  removeMilestone(milestoneUuid: string): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.milestoneLoading.set(true);
    this.milestoneService.delete(projectUuid, milestoneUuid).subscribe({
      next: () => this.loadMilestones(projectUuid),
      error: (error) => {
        console.error('Error deleting milestone', error);
        this.milestoneError.set('We couldn\'t delete the milestone.');
        this.milestoneLoading.set(false);
      },
    });
  }

  saveTask(command: UpsertTaskCommand): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.taskLoading.set(true);
    this.taskService.create(projectUuid, command).subscribe({
      next: () => {
        this.taskForm?.resetForm();
        this.loadTasks(projectUuid);
      },
      error: (error) => {
        console.error('Error creating task', error);
        this.taskError.set('We couldn\'t create the task.');
        this.taskLoading.set(false);
      },
    });
  }

  removeTask(taskUuid: string): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.taskLoading.set(true);
    this.taskService.delete(projectUuid, taskUuid).subscribe({
      next: () => this.loadTasks(projectUuid),
      error: (error) => {
        console.error('Error deleting task', error);
        this.taskError.set('We couldn\'t delete the task.');
        this.taskLoading.set(false);
      },
    });
  }

  refreshAnalysis(): void {
    const projectUuid = this.projectUuid();
    if (projectUuid) {
      this.loadAnalysis(projectUuid);
    }
  }

  refreshMilestones(): void {
    const projectUuid = this.projectUuid();
    if (projectUuid) {
      this.loadMilestones(projectUuid);
    }
  }

  refreshTasks(): void {
    const projectUuid = this.projectUuid();
    if (projectUuid) {
      this.loadTasks(projectUuid);
    }
  }

  trackMilestone(_: number, milestone: Milestone): string {
    return milestone.uuid;
  }

  trackTask(_: number, task: Task): string {
    return task.uuid;
  }

  private loadProject(projectUuid: string): void {
    this.projectLoading.set(true);
    this.projectService.get(projectUuid).subscribe({
      next: (project) => {
        this.project.set(project);
        this.projectError.set(null);
      },
      error: (error) => {
        console.error('Unable to load project', error);
        this.project.set(undefined);
        this.projectError.set('We couldn\'t load the project.');
      },
      complete: () => this.projectLoading.set(false),
    });
  }

  private loadMilestones(projectUuid: string): void {
    this.milestoneLoading.set(true);
    this.milestoneService.list(projectUuid).subscribe({
      next: (milestones) => {
        this.milestones.set(milestones);
        this.milestoneError.set(null);
      },
      error: (error) => {
        console.error('Unable to load milestones', error);
        this.milestones.set([]);
        this.milestoneError.set('We couldn\'t load the milestones.');
        this.milestoneLoading.set(false);
      },
      complete: () => this.milestoneLoading.set(false),
    });
  }

  private loadTasks(projectUuid: string): void {
    this.taskLoading.set(true);
    this.taskService.list(projectUuid).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.taskError.set(null);
      },
      error: (error) => {
        console.error('Unable to load tasks', error);
        this.tasks.set([]);
        this.taskError.set('We couldn\'t load the tasks.');
        this.taskLoading.set(false);
      },
      complete: () => this.taskLoading.set(false),
    });
  }

  private loadAnalysis(projectUuid: string): void {
    this.analysisLoading.set(true);
    this.analysisService.getProjectAnalysis(projectUuid).subscribe({
      next: (analysis) => {
        this.analysis.set(analysis);
        this.analysisError.set(null);
      },
      error: (error) => {
        console.error('Unable to load project analysis', error);
        this.analysis.set(undefined);
        this.analysisError.set('We couldn\'t load the analysis.');
        this.analysisLoading.set(false);
      },
      complete: () => this.analysisLoading.set(false),
    });
  }
}
