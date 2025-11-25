import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Task, TaskStatus, UpsertTaskCommand } from '../../../model/task.model';
import { TaskService } from '../../../service/task-service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { ProjectMember } from '../../../model/project.model';
import { Milestone } from '../../../model/milestone.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm {
  private taskService = inject(TaskService);

  form = this.taskService.form();
  data = input<Task>();
  members = input<Array<ProjectMember>>([]);
  milestones = input<Array<Milestone>>([]);
  submitted = output<UpsertTaskCommand>();
  cancelled = output<void>();
  readonly statuses: Array<{ value: TaskStatus; label: string }> = [
    { value: 'pending', label: 'form.task.status.pending' },
    { value: 'done', label: 'form.task.status.done' },
  ];
  readonly isEditing = computed(() => !!this.data());

  constructor() {
    effect(() => this.resetFormState(this.data()));
  }

  save(): void {
    if (this.form.invalid) {
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

  private resetFormState(task?: Task): void {
    this.form = this.taskService.form(task);
  }
}
