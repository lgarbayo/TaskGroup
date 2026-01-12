import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProjectService } from '../../service/project-service';
import { Project, UpsertProjectCommand } from '../../model/project.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { KeyValuePipe, DecimalPipe } from '@angular/common';
import { Milestone, UpsertMilestoneCommand } from '../../model/milestone.model';
import { Task, TaskStatus, UpsertTaskCommand } from '../../model/task.model';
import { TaskComment } from '../../model/task-comment.model';
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
import { TaskCommentService } from '../../service/task-comment-service';
import { MilestoneAnalysis, ProjectAnalysis, TaskAnalysis } from '../../model/analysis.model';
import { TaskGantt } from '../../component/project/task-gantt/task-gantt';
import { DateType } from '../../model/core.model';
import { TranslationService } from '../../i18n/translation.service';

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
    TaskGantt,
    TranslatePipe
  ],
  templateUrl: './project-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailPage {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private milestoneService = inject(MilestoneService);
  private taskService = inject(TaskService);
  private nfb = inject(NonNullableFormBuilder);
  protected core = inject(CoreService);
  private authService = inject(AuthService);
  private analysisService = inject(AnalysisService);
  private commentService = inject(TaskCommentService);
  private translation = inject(TranslationService);

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
  showProjectViewModal = signal(false);
  showMilestoneModal = signal(false);
  showTaskModal = signal(false);
  showMemberModal = signal(false);
  showProjectAnalysisModal = signal(false);
  showMilestoneAnalysisModal = signal(false);
  showTaskAnalysisModal = signal(false);
  showMemberListModal = signal(false);
  showTaskCommentsModal = signal(false);
  showTaskViewModal = signal(false);
  showMilestoneViewModal = signal(false);

  memberForm = this.nfb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  commentForm = this.nfb.group({
    body: ['', [Validators.required]],
  });

  pendingTasks = computed(() => this.tasks().filter((task) => task.status === 'pending'));
  inProgressTasks = computed(() => this.tasks().filter((task) => task.status === 'in_progress'));
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
    const inProgress = all.filter((task) => task.status === 'in_progress').length;
    const pending = all.filter((task) => task.status === 'pending').length;
    return { total, done, pending, inProgress };
  });

  analysisLoading = signal(false);
  analysisError = signal<string | null>(null);
  projectAnalysis = signal<ProjectAnalysis | null>(null);
  selectedMilestoneAnalysis = signal<MilestoneAnalysis | null>(null);
  selectedTaskAnalysis = signal<TaskAnalysis | null>(null);
  selectedTaskForComments = signal<Task | null>(null);
  selectedTaskForView = signal<Task | null>(null);
  selectedMilestoneForView = signal<Milestone | null>(null);
  taskComments = signal<Array<TaskComment>>([]);
  commentLoading = signal(false);
  commentError = signal<string | null>(null);
  editingCommentId = signal<number | null>(null);

  editCommentForm = this.nfb.group({
    body: ['', [Validators.required]],
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

  openProjectView(): void {
    this.showProjectViewModal.set(true);
  }

  closeProjectView(): void {
    this.showProjectViewModal.set(false);
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
    const editing = this.selectedMilestone();
    const request$ = editing
      ? this.milestoneService.update(projectUuid, editing.uuid, command)
      : this.milestoneService.create(projectUuid, command);
    request$.subscribe({
      next: () => {
        this.cancelMilestoneEdition();
        this.loadMilestones(projectUuid);
      },
      error: (error) => {
        console.error('Error saving milestone', error);
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

  openMilestoneView(milestone: Milestone): void {
    this.selectedMilestoneForView.set(milestone);
    this.showMilestoneViewModal.set(true);
  }

  closeMilestoneView(): void {
    this.showMilestoneViewModal.set(false);
    this.selectedMilestoneForView.set(null);
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

  openTaskView(task: Task): void {
    this.selectedTaskForView.set(task);
    this.showTaskViewModal.set(true);
  }

  closeTaskView(): void {
    this.showTaskViewModal.set(false);
    this.selectedTaskForView.set(null);
  }

  cancelTaskEdition(): void {
    this.selectedTask.set(null);
    this.taskForm?.resetForm();
    this.showTaskModal.set(false);
  }

  openTaskComments(task: Task): void {
    this.selectedTaskForComments.set(task);
    this.commentForm.reset({ body: '' });
    this.editingCommentId.set(null);
    this.editCommentForm.reset({ body: '' });
    this.commentError.set(null);
    this.showTaskCommentsModal.set(true);
    const projectUuid = this.projectUuid();
    if (projectUuid) {
      this.loadTaskComments(projectUuid, task.uuid);
    }
  }

  closeTaskComments(): void {
    this.showTaskCommentsModal.set(false);
    this.selectedTaskForComments.set(null);
    this.taskComments.set([]);
  }

  onTaskTimelineChange(change: { task: Task; startDate: Date; durationWeeks: number }): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    const updatedStart = this.fromDate(change.startDate);
    const updatedTask: Task = {
      ...change.task,
      startDate: updatedStart,
      durationWeeks: change.durationWeeks,
    };
    this.tasks.update((list) => list.map((task) => (task.uuid === updatedTask.uuid ? updatedTask : task)));
    const command: UpsertTaskCommand = {
      title: updatedTask.title,
      description: updatedTask.description,
      durationWeeks: updatedTask.durationWeeks,
      startDate: updatedStart,
      status: updatedTask.status,
      priority: updatedTask.priority,
      assigneeIds: updatedTask.assignees?.map((assignee) => assignee.id) ?? [],
      milestoneUuid: updatedTask.milestone?.uuid ?? null,
    };
    this.taskService.update(projectUuid, updatedTask.uuid, command).subscribe({
      next: () => {
        this.taskError.set(null);
        this.loadTasks(projectUuid);
        this.loadAnalysis(projectUuid);
      },
      error: (error) => {
        console.error('Error updating task', error);
        this.taskError.set('project.tasks.error');
        this.loadTasks(projectUuid);
      },
    });
  }

  onTaskStatusChange(change: { task: Task; status: TaskStatus }): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    const updatedTask: Task = {
      ...change.task,
      status: change.status,
    };
    this.tasks.update((list) => list.map((task) => (task.uuid === updatedTask.uuid ? updatedTask : task)));
    const command: UpsertTaskCommand = {
      title: updatedTask.title,
      description: updatedTask.description,
      durationWeeks: updatedTask.durationWeeks,
      startDate: updatedTask.startDate,
      status: updatedTask.status,
      priority: updatedTask.priority,
      assigneeIds: updatedTask.assignees?.map((assignee) => assignee.id) ?? [],
      milestoneUuid: updatedTask.milestone?.uuid ?? null,
    };
    this.taskService.update(projectUuid, updatedTask.uuid, command).subscribe({
      next: () => {
        this.taskError.set(null);
        this.loadTasks(projectUuid);
        this.loadAnalysis(projectUuid);
      },
      error: (error) => {
        console.error('Error updating task status', error);
        this.taskError.set('project.tasks.error');
        this.loadTasks(projectUuid);
      },
    });
  }

  addComment(): void {
    const projectUuid = this.projectUuid();
    const task = this.selectedTaskForComments();
    if (!projectUuid || !task) {
      return;
    }
    const body = this.commentForm.controls.body.value?.trim();
    if (!body) {
      this.commentForm.markAllAsTouched();
      return;
    }
    this.commentLoading.set(true);
    this.commentService.create(projectUuid, task.uuid, { body }).subscribe({
      next: (comment) => {
        this.taskComments.update((list) => [...list, comment]);
        this.commentForm.reset({ body: '' });
        this.commentError.set(null);
      },
      error: (error) => {
        console.error('Error adding comment', error);
        this.commentError.set('project.tasks.comments.error');
        this.commentLoading.set(false);
      },
      complete: () => this.commentLoading.set(false),
    });
  }

  startEditComment(comment: TaskComment): void {
    this.editingCommentId.set(comment.id);
    this.editCommentForm.reset({ body: comment.body });
  }

  cancelEditComment(): void {
    this.editingCommentId.set(null);
    this.editCommentForm.reset({ body: '' });
  }

  saveEditComment(comment: TaskComment): void {
    const projectUuid = this.projectUuid();
    const task = this.selectedTaskForComments();
    if (!projectUuid || !task) {
      return;
    }
    const body = this.editCommentForm.controls.body.value?.trim();
    if (!body) {
      return;
    }
    this.commentLoading.set(true);
    this.commentService.update(projectUuid, task.uuid, comment.id, { body }).subscribe({
      next: (updated) => {
        this.taskComments.update((list) => list.map((item) => (item.id === updated.id ? updated : item)));
        this.cancelEditComment();
        this.commentError.set(null);
      },
      error: (error) => {
        console.error('Error updating comment', error);
        this.commentError.set('project.tasks.comments.error');
        this.commentLoading.set(false);
      },
      complete: () => this.commentLoading.set(false),
    });
  }

  deleteComment(comment: TaskComment): void {
    const projectUuid = this.projectUuid();
    const task = this.selectedTaskForComments();
    if (!projectUuid || !task) {
      return;
    }
    this.commentLoading.set(true);
    this.commentService.delete(projectUuid, task.uuid, comment.id).subscribe({
      next: () => {
        this.taskComments.update((list) => list.filter((item) => item.id !== comment.id));
        this.commentError.set(null);
      },
      error: (error) => {
        console.error('Error deleting comment', error);
        this.commentError.set('project.tasks.comments.error');
        this.commentLoading.set(false);
      },
      complete: () => this.commentLoading.set(false),
    });
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
    this.analysisError.set(null);
    this.analysisLoading.set(true);
    this.loadAnalysis(projectUuid, () => {
      const milestone = this.projectAnalysis()
        ?.milestoneList.find((m) => m.taskList.some((task) => task.taskUuid === taskUuid));
      const task = milestone?.taskList.find((item) => item.taskUuid === taskUuid) ?? null;
      if (!task) {
        const fallbackTask = this.tasks().find((item) => item.uuid === taskUuid);
        if (!fallbackTask) {
          this.analysisError.set('project.analysis.taskMissing');
          this.analysisLoading.set(false);
          this.showTaskAnalysisModal.set(true);
          return;
        }
        this.selectedMilestoneAnalysis.set(null);
        this.selectedTaskAnalysis.set(this.buildTaskAnalysis(fallbackTask));
        this.analysisLoading.set(false);
        this.showTaskAnalysisModal.set(true);
        return;
      }
      this.selectedMilestoneAnalysis.set(milestone ?? null);
      this.selectedTaskAnalysis.set(task);
      this.analysisLoading.set(false);
      this.showTaskAnalysisModal.set(true);
    });
  }

  closeTaskAnalysis(): void {
    this.showTaskAnalysisModal.set(false);
    this.selectedTaskAnalysis.set(null);
    this.selectedMilestoneAnalysis.set(null);
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

  leaveProject(): void {
    const projectUuid = this.projectUuid();
    if (!projectUuid) {
      return;
    }
    this.memberLoading.set(true);
    this.memberError.set(null);
    this.memberSuccess.set(null);
    this.projectService.leaveProject(projectUuid).subscribe({
      next: () => {
        this.router.navigate(['/list']);
      },
      error: (error) => {
        console.error('Unable to leave project', error);
        this.memberError.set('project.members.leaveError');
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

  isCommentAuthor(comment: TaskComment): boolean {
    return comment.author.id === this.currentUserId();
  }

  formatCommentDate(value: string): string {
    if (!value) {
      return '';
    }
    const lang = this.translation.language();
    const locale = lang === 'es' ? 'es-ES' : lang === 'gl' ? 'gl-ES' : 'en-US';
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  }

  formatTaskAssignees(task: Task): string {
    return (task.assignees ?? []).map((assignee) => assignee.alias).join(', ');
  }

  trackMember(_: number, member: { id: number }): number {
    return member.id;
  }

  roleLabel(role?: string | null): string {
    if (!role) {
      return '';
    }
    const normalized = role.toLowerCase();
    if (normalized === 'owner') {
      return 'project.members.role.owner';
    }
    if (normalized === 'member') {
      return 'project.members.role.member';
    }
    return role;
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

  private buildTaskAnalysis(task: Task): TaskAnalysis {
    const now = new Date();
    const initialCompletion = this.taskCompletionAt(task, now);
    const endCompletion = this.taskCompletionAt(task, this.taskEndDate(task));
    return {
      taskUuid: task.uuid,
      taskTitle: task.title,
      initialCompletion,
      endCompletion,
    };
  }

  private taskCompletionAt(task: Task, date: Date): number {
    const start = this.toDate(task.startDate);
    const end = this.taskEndDate(task);
    if (date < start) {
      return 0;
    }
    if (date >= end) {
      return 1;
    }
    const totalDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000));
    const elapsedDays = Math.max(0, Math.floor((date.getTime() - start.getTime()) / 86400000));
    const completion = elapsedDays / totalDays;
    return Math.max(0, Math.min(1, completion));
  }

  private taskEndDate(task: Task): Date {
    const start = this.toDate(task.startDate);
    const weeks = Math.max(task.durationWeeks ?? 1, 1);
    const end = new Date(start);
    end.setDate(end.getDate() + weeks * 7);
    return end;
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

  private loadTaskComments(projectUuid: string, taskUuid: string): void {
    this.commentLoading.set(true);
    this.commentService.list(projectUuid, taskUuid).subscribe({
      next: (comments) => {
        this.taskComments.set(comments);
        this.commentError.set(null);
      },
      error: (error) => {
        console.error('Error loading comments', error);
        this.taskComments.set([]);
        this.commentError.set('project.tasks.comments.error');
        this.commentLoading.set(false);
      },
      complete: () => this.commentLoading.set(false),
    });
  }

}
