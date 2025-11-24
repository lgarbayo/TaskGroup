import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Task, UpsertTaskCommand } from '../../../model/task.model';
import { TaskService } from '../../../service/task-service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm {
  private taskService = inject(TaskService);

  form = this.taskService.form();
  data = input<Task>();
  submitted = output<UpsertTaskCommand>();

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

  resetForm(): void {
    this.resetFormState(this.data());
  }

  private resetFormState(task?: Task): void {
    this.form = this.taskService.form(task);
  }
}
