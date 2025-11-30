import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Milestone, UpsertMilestoneCommand } from '../../../model/milestone.model';
import { MilestoneService } from '../../../service/milestone-service';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CoreService } from '../../../service/core-service';

@Component({
  selector: 'app-milestone-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './milestone-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilestoneForm {
  private milestoneService = inject(MilestoneService);
  protected core = inject(CoreService);

  form = this.milestoneService.form();
  data = input<Milestone>();
  submitted = output<UpsertMilestoneCommand>();
  cancelled = output<void>();

  constructor() {
    effect(() => this.resetFormState(this.data()));
  }

  save(): void {
    const titleControl = this.form.controls.title;
    titleControl.setValue(titleControl.value.trim(), { emitEvent: false });
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }

  resetForm(): void {
    this.resetFormState(this.data());
  }

  cancelEdition(): void {
    this.cancelled.emit();
  }

  private resetFormState(milestone?: Milestone): void {
    this.form = this.milestoneService.form(milestone);
  }
}
