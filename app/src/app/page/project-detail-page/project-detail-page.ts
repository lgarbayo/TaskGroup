import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProjectService } from '../../service/project-service';
import { Project, UpsertProjectCommand } from '../../model/project.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { KeyValuePipe, DecimalPipe } from '@angular/common';
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
import { CoreService } from '../../service/core-service';
import { AuthService } from '../../service/auth-service';
import { AnalysisService } from '../../service/analysis-service';
import { MilestoneAnalysis, ProjectAnalysis, TaskAnalysis } from '../../model/analysis.model';
import { DateType } from '../../model/core.model';

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [
    KeyValuePipe,
    DecimalPipe,
    ReactiveFormsModule,
    ProjectForm,
    MilestoneForm,
    TaskForm,
    TranslatePipe
  ],
  templateUrl: './project-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailPage {
  private activatedRoute = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private milestoneService = inject(MilestoneService);
  private taskService = inject(TaskService);
  private nfb = inject(NonNullableFormBuilder);
  protected core = inject(CoreService);
  private authService = inject(AuthService);
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
  selectedTask = signal<Task | null>(null);
  selectedMilestone = signal<Milestone | null>(null);

  projectLoading = signal(false);
  projectError = signal<string | null>(null);
  milestoneLoading = signal(false);
  milestoneError = signal<string | null>(null);
  taskLoading = signal(false);
  taskError = signal<string | null>(null);
  memberLoading = signal(false);
  memberError = signal<string | null>(null);
  memberSuccess = signal<string | null>(null);
  showMeta = signal(false);
  showProjectModal = signal(false);
  showMilestoneModal = signal(false);
  showTaskModal = signal(false);
  showMemberModal = signal(false);
  showProjectAnalysisModal = signal(false);
  showMilestoneAnalysisModal = signal(false);
  showTaskAnalysisModal = signal(false);
  showSparklineModal = signal(false);
  showMemberListModal = signal(false);

  memberForm = this.nfb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  pendingTasks = computed(() => this.tasks().filter((task) => task.status !== 'done'));
  doneTasks = computed(() => this.tasks().filter((task) => task.status === 'done'));
  currentUserId = computed(() => this.authService.user()?.id ?? null);
  timelineRange = computed(() => {
    const projectDetail = this.project();
    if (!projectDetail?.startDate || !projectDetail?.endDate) {
      return null;
    }
    const start = this.linearIndex(projectDetail.startDate);
    const end = this.linearIndex(projectDetail.endDate);
    return {
      start,
      total: Math.max(end - start + 1, 1),
    };
  });
  taskSummary = computed(() => {
    const all = this.tasks();
    const total = all.length;
    const done = all.filter((task) => task.status === 'done').length;
    const pending = total - done;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pending, progress };
  });

  analysisLoading = signal(false);
  analysisError = signal<string | null>(null);
  projectAnalysis = signal<ProjectAnalysis | null>(null);
  selectedMilestoneAnalysis = signal<MilestoneAnalysis | null>(null);
  selectedTaskAnalysis = signal<TaskAnalysis | null>(null);

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

  taskSparklineStyle(task: Task): { left: string; width: string } {
    const range = this.timelineRange();
    if (!range || !task.startDate) {
      return { left: '0%', width: '0%' };
    }
    const offset = Math.max(this.linearIndex(task.startDate) - range.start, 0);
    const duration = Math.max(task.durationWeeks ?? 1, 1);
    const leftPercent = Math.min(100, (offset / range.total) * 100);
    const widthPercent = Math.min(100 - leftPercent, (duration / range.total) * 100);
    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 2)}%`,
    };
  }

  taskEndLabel(task: Task): string {
    if (!task.startDate) {
      return '—';
    }
    const startDate = this.toDate(task.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.max(task.durationWeeks ?? 1, 1) * 7);
    return this.core.formatDateLabel(this.fromDate(endDate));
  }

  taskStartLabel(task: Task): string {
    return task.startDate ? this.core.formatDateLabel(task.startDate) : '—';
  }

  taskProgressValue(task: Task): number {
    if (!task.startDate) {
      return 0;
    }
    const today = new Date();
    const startDate = this.toDate(task.startDate);
    const durationWeeks = Math.max(task.durationWeeks ?? 1, 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationWeeks * 7);

    if (today >= endDate) {
      return 100;
    }
    if (today <= startDate) {
      return 0;
    }

    const elapsedMs = today.getTime() - startDate.getTime();
    const totalMs = endDate.getTime() - startDate.getTime();
    return Math.min(100, Math.round((elapsedMs / totalMs) * 100));
  }

  update(data: UpsertProjectCommand): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) return;
    this.projectService.updateProject(projectUuid, data).subscribe({
      next: (updated) => {
        this.project.set(updated);
        this.projectError.set(null);
        this.showProjectModal.set(false);
      },
      error: (error) => {
        console.error('Error updating project', error);
        this.projectError.set('projects.error.load');
      },
    });
  }

  openProjectModal(): void {
    this.showProjectModal.set(true);
  }

  closeProjectModal(): void {
    this.showProjectModal.set(false);
  }

  openMilestoneModal(milestone?: Milestone): void {
    this.selectedMilestone.set(milestone ?? null);
    this.showMilestoneModal.set(true);
  }

  cancelMilestoneEdition(): void {
    this.selectedMilestone.set(null);
    this.milestoneForm?.resetForm();
    this.showMilestoneModal.set(false);
  }

  saveMilestone(command: UpsertMilestoneCommand): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.milestoneLoading.set(true);
    this.milestoneService.create(projectUuid, command).subscribe({
      next: () => {
        this.cancelMilestoneEdition();
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

  editMilestone(milestone: Milestone): void {
    this.openMilestoneModal(milestone);
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
        this.cancelTaskEdition();
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
    this.openTaskModal(task);
  }

  openTaskModal(task?: Task): void {
    this.selectedTask.set(task ?? null);
    this.showTaskModal.set(true);
  }

  cancelTaskEdition(): void {
    this.selectedTask.set(null);
    this.taskForm?.resetForm();
    this.showTaskModal.set(false);
  }

  openMemberModal(): void {
    this.memberError.set(null);
    this.memberSuccess.set(null);
    this.memberForm.reset({ email: '' });
    this.showMemberModal.set(true);
  }

  closeMemberModal(): void {
    this.showMemberModal.set(false);
  }

  openMemberListModal(): void {
    this.showMemberListModal.set(true);
  }

  closeMemberListModal(): void {
    this.showMemberListModal.set(false);
  }

  toggleMeta(): void {
    this.showMeta.update(value => !value);
  }

  openProjectAnalysis(): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.analysisError.set(null);
    this.showProjectAnalysisModal.set(true);
    this.loadAnalysis(projectUuid);
  }

  closeProjectAnalysis(): void {
    this.showProjectAnalysisModal.set(false);
  }

  openMilestoneAnalysis(milestoneUuid: string): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.loadAnalysis(projectUuid, () => {
      const milestone = this.projectAnalysis()
        ?.milestoneList.find((item) => item.milestoneUuid === milestoneUuid);
      if (!milestone) {
        this.analysisError.set('project.analysis.milestoneMissing');
        return;
      }
      this.selectedMilestoneAnalysis.set(milestone);
      this.showMilestoneAnalysisModal.set(true);
    });
  }

  closeMilestoneAnalysis(): void {
    this.showMilestoneAnalysisModal.set(false);
    this.selectedMilestoneAnalysis.set(null);
  }

  openTaskAnalysis(taskUuid: string): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.loadAnalysis(projectUuid, () => {
      const milestone = this.projectAnalysis()
        ?.milestoneList.find((m) => m.taskList.some((task) => task.taskUuid === taskUuid));
      const task = milestone?.taskList.find((item) => item.taskUuid === taskUuid) ?? null;
      if (!task) {
        this.analysisError.set('project.analysis.taskMissing');
        return;
      }
      this.selectedMilestoneAnalysis.set(milestone ?? null);
      this.selectedTaskAnalysis.set(task);
      this.showTaskAnalysisModal.set(true);
    });
  }

  closeTaskAnalysis(): void {
    this.showTaskAnalysisModal.set(false);
    this.selectedTaskAnalysis.set(null);
    this.selectedMilestoneAnalysis.set(null);
  }

  openSparkline(): void {
    this.showSparklineModal.set(true);
  }

  closeSparkline(): void {
    this.showSparklineModal.set(false);
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

  removeMember(memberId: number): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.memberLoading.set(true);
    this.projectService.removeMember(projectUuid, memberId).subscribe({
      next: (project) => {
        this.project.set(project);
        this.memberError.set(null);
        this.memberSuccess.set('project.members.removeSuccess');
      },
      error: (error) => {
        console.error('Unable to remove member', error);
        this.memberError.set('project.members.removeError');
        this.memberSuccess.set(null);
        this.memberLoading.set(false);
      },
      complete: () => this.memberLoading.set(false),
    });
  }

  private loadAnalysis(projectUuid: string, onReady?: () => void): void {
    if (this.projectAnalysis()) {
      onReady?.();
      return;
    }
    this.analysisLoading.set(true);
    this.analysisService.projectAnalysis(projectUuid).subscribe({
      next: (analysis) => {
        this.projectAnalysis.set(analysis);
        this.analysisLoading.set(false);
        this.analysisError.set(null);
        onReady?.();
      },
      error: (error) => {
        console.error('Error loading analysis', error);
        this.analysisError.set('project.analysis.error');
        this.analysisLoading.set(false);
      },
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

  private linearIndex(date: DateType): number {
    return date.year * 48 + date.month * 4 + (date.week ?? 0);
  }

  private toDate(date: DateType): Date {
    const week = date.week ?? 0;
    return new Date(date.year, date.month, 1 + week * 7);
  }

  private fromDate(value: Date): DateType {
    const year = value.getFullYear();
    const month = value.getMonth();
    const week = Math.min(Math.floor((value.getDate() - 1) / 7), 3);
    return { year, month, week };
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
