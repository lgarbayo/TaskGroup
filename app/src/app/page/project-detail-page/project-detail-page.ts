import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProjectService } from '../../service/project-service';
import { Project, UpsertProjectCommand } from '../../model/project.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { KeyValuePipe } from '@angular/common';
import { Milestone, UpsertMilestoneCommand } from '../../model/milestone.model';
import { Task, UpsertTaskCommand } from '../../model/task.model';
import { MilestoneService } from '../../service/milestone-service';
import { TaskService } from '../../service/task-service';
import { ProjectForm } from "../../component/project/project-form/project-form";
import { MilestoneForm } from "../../component/project/milestone-form/milestone-form";
import { TaskForm } from "../../component/project/task-form/task-form";
import { TranslatePipe } from '../../i18n/translate.pipe';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [
    KeyValuePipe,
    ReactiveFormsModule,
    ProjectForm,
    MilestoneForm,
    TaskForm,
    TranslatePipe
],
  templateUrl: './project-detail-page.html',
  styleUrl: './project-detail-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailPage {
  private activatedRoute = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private milestoneService = inject(MilestoneService);
  private taskService = inject(TaskService);
  private nfb = inject(NonNullableFormBuilder);

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
  selectedTask = signal<Task | null>(null);

  projectLoading = signal(false);
  projectError = signal<string | null>(null);
  milestoneLoading = signal(false);
  milestoneError = signal<string | null>(null);
  taskLoading = signal(false);
  taskError = signal<string | null>(null);
  memberLoading = signal(false);
  memberError = signal<string | null>(null);
  memberSuccess = signal<string | null>(null);

  memberForm = this.nfb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  pendingTasks = computed(() => this.tasks().filter((task) => task.status !== 'done'));
  doneTasks = computed(() => this.tasks().filter((task) => task.status === 'done'));
  taskSummary = computed(() => {
    const all = this.tasks();
    const total = all.length;
    const done = all.filter((task) => task.status === 'done').length;
    const pending = total - done;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pending, progress };
  });

  constructor() {
    effect(() => {
      const projectUuid = this.projectUuid();
      if (projectUuid) {
        this.loadProject(projectUuid);
        this.loadMilestones(projectUuid);
        this.loadTasks(projectUuid);
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
        this.projectError.set('projects.error.load');
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
        this.milestoneError.set('project.milestones.error');
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
        this.milestoneError.set('project.milestones.error');
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
    const editing = this.selectedTask();
    const request$ = editing
      ? this.taskService.update(projectUuid, editing.uuid, command)
      : this.taskService.create(projectUuid, command);

    request$.subscribe({
      next: () => {
        this.taskForm?.resetForm();
        this.selectedTask.set(null);
        this.loadTasks(projectUuid);
      },
      error: (error) => {
        console.error('Error saving task', error);
        this.taskError.set('project.tasks.error');
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
        this.taskError.set('project.tasks.error');
        this.taskLoading.set(false);
      },
    });
  }

  editTask(task: Task): void {
    this.selectedTask.set(task);
  }

  cancelTaskEdition(): void {
    this.selectedTask.set(null);
    this.taskForm?.resetForm();
  }

  addMember(): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      return;
    }
    this.memberLoading.set(true);
    this.projectService.addMember(projectUuid, { email: this.memberForm.controls.email.value }).subscribe({
      next: (project) => {
        this.project.set(project);
        this.memberForm.reset({ email: '' });
        this.memberError.set(null);
        this.memberSuccess.set('project.members.success');
      },
      error: (error) => {
        console.error('Unable to add member', error);
        this.memberError.set('project.members.error');
        this.memberSuccess.set(null);
        this.memberLoading.set(false);
      },
      complete: () => this.memberLoading.set(false),
    });
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

  trackMember(_: number, member: { id: number }): number {
    return member.id;
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
        this.projectError.set('projects.error.load');
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
        this.milestoneError.set('project.milestones.error');
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
        this.taskError.set('project.tasks.error');
        this.taskLoading.set(false);
      },
      complete: () => this.taskLoading.set(false),
    });
  }

}
