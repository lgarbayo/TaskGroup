import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Task, TaskStatus, UpsertTaskCommand } from '../../../model/task.model';
import { TaskService } from '../../../service/task-service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { ProjectMember } from '../../../model/project.model';
import { Milestone } from '../../../model/milestone.model';
import { CoreService } from '../../../service/core-service';
import { DateType } from '../../../model/core.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './task-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm implements OnDestroy {
  private taskService = inject(TaskService);
  protected core = inject(CoreService);

  form = this.taskService.form();
  data = input<Task>();
  members = input<Array<ProjectMember>>([]);
  milestones = input<Array<Milestone>>([]);
  projectRange = input<{ start: DateType; end: DateType } | null>(null);
  defaultAssigneeId = input<number | null>(null);
  submitted = output<UpsertTaskCommand>();
  cancelled = output<void>();
  private formChanges?: Subscription;
  readonly statuses: Array<{ value: TaskStatus; label: string }> = [
    { value: 'pending', label: 'form.task.status.pending' },
    { value: 'done', label: 'form.task.status.done' },
  ];
  readonly isEditing = computed(() => !!this.data());

  constructor() {
    effect(() => this.resetFormState(this.data()));
    effect(() => {
      this.milestones();
      this.projectRange();
      this.validateRanges(false);
    });
  }

  save(): void {
    const titleControl = this.form.controls.title;
    titleControl.setValue(titleControl.value.trim(), { emitEvent: false });
    if (this.form.invalid || !this.validateRanges()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }

  cancelEdit(): void {
    this.resetFormState();
    this.cancelled.emit();
  }

  resetForm(): void {
    this.resetFormState(this.data());
  }

  ngOnDestroy(): void {
    this.formChanges?.unsubscribe();
  }

  private resetFormState(task?: Task): void {
    this.form = this.taskService.form(task);
    if (!task) {
      const defaultAssignee = this.defaultAssigneeId();
      if (defaultAssignee != null) {
        this.form.controls.assigneeId.setValue(defaultAssignee);
      }
    }
    this.formChanges?.unsubscribe();
    this.formChanges = this.form.valueChanges.subscribe(() => this.validateRanges(false));
  }

  private validateRanges(markTouched = true): boolean {
    const startGroup = this.form.controls.startDate;
    const { year, month, week } = startGroup.value ?? {};
    if (year == null || month == null || week == null) {
      startGroup.setErrors(startGroup.errors ?? null);
      return true;
    }
    const start: DateType = { year, month, week };
    const duration = Math.max(this.form.controls.durationWeeks.value ?? 1, 1);
    const taskStart = this.linearIndex(start);
    const taskEnd = taskStart + duration - 1;

    const baseErrors = { ...(startGroup.errors ?? {}) };
    delete baseErrors['projectRange'];
    delete baseErrors['milestoneRange'];
    let errors: Record<string, boolean> | null =
      Object.keys(baseErrors).length > 0 ? baseErrors : null;
    let valid = true;

    const range = this.projectRange();
    if (range) {
      const projectStart = this.linearIndex(range.start);
      const projectEnd = this.linearIndex(range.end);
      if (taskStart < projectStart || taskEnd > projectEnd) {
        errors = { ...(errors ?? {}), projectRange: true };
        valid = false;
      }
    }

    const milestoneId = this.form.controls.milestoneUuid.value;
    if (milestoneId) {
      const milestone = this.milestones().find((m) => m.uuid === milestoneId);
      if (milestone) {
        const milestoneEnd = this.linearIndex(milestone.date);
        if (taskEnd > milestoneEnd) {
          errors = { ...(errors ?? {}), milestoneRange: true };
          valid = false;
        }
      }
    }

    startGroup.setErrors(errors);
    if (!valid && markTouched) {
      startGroup.markAllAsTouched();
    }
    return valid;
  }

  private linearIndex(date: DateType): number {
    return date.year * 48 + date.month * 4 + date.week;
  }
}
