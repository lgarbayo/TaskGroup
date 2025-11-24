import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Milestone, UpsertMilestoneCommand } from '../../../model/milestone.model';
import { MilestoneService } from '../../../service/milestone-service';

@Component({
  selector: 'app-milestone-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './milestone-form.html',
  styleUrl: './milestone-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilestoneForm {
  private milestoneService = inject(MilestoneService);

  form = this.milestoneService.form();
  data = input<Milestone>();
  submitted = output<UpsertMilestoneCommand>();

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

  private resetFormState(milestone?: Milestone): void {
    this.form = this.milestoneService.form(milestone);
  }
}
