import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { Project, UpsertProjectCommand } from '../../../model/project.model';
import { ProjectService } from '../../../service/project-service';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { CoreService } from '../../../service/core-service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './project-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectForm {
  private projectService = inject(ProjectService);
  private nfb = inject(NonNullableFormBuilder);
  protected core = inject(CoreService);

  form = this.projectService.projectForm();
  additionalFieldForm = this.nfb.group({
    key: ['', [Validators.required]],
    value: ['', [Validators.required]],
  });

  data = input<Project>();
  edited = output<UpsertProjectCommand>();
  cancelled = output<void>();

  constructor() {
    effect(() => this.resetFormState(this.data()));
  }

  save(): void {
    const titleControl = this.form.controls.title;
    titleControl.setValue(titleControl.value.trim(), { emitEvent: false });
    if (!titleControl.value) {
      titleControl.setErrors({ required: true });
    }
    if (this.form.valid) {
      this.edited.emit(this.form.getRawValue());
      return;
    }
    this.form.markAllAsTouched();
  }

  addAdditionalField(): void {
    if (this.additionalFieldForm.invalid) {
      this.additionalFieldForm.markAllAsTouched();
      return;
    }

    const key = this.additionalFieldForm.controls.key.value.trim();
    const value = this.additionalFieldForm.controls.value.value.trim();
    if (!key) {
      this.additionalFieldForm.controls.key.setErrors({ required: true });
      return;
    }
    if (!value) {
      this.additionalFieldForm.controls.value.setErrors({ required: true });
      return;
    }

    if (this.form.controls.additionalFields.controls[key]) {
      this.additionalFieldForm.controls.key.setErrors({ duplicated: true });
      return;
    }

    this.form.controls.additionalFields.addControl(key, this.nfb.control(value));
    this.additionalFieldForm.reset();
  }

  removeAdditionalField(key: string): void {
    this.form.controls.additionalFields.removeControl(key);
  }

  additionalFieldList(): Array<{ key: string; control: FormControl<string> }> {
    return Object.entries(this.form.controls.additionalFields.controls).map(([key, control]) => ({
      key,
      control,
    }));
  }

  resetForm(): void {
    this.resetFormState(this.data());
  }

  cancelProjectEdition(): void {
    this.cancelled.emit();
  }

  dateRangeError(): boolean {
    return !!this.form.errors?.['dateRange'] && this.form.touched;
  }

  private resetFormState(project?: Project): void {
    this.form = this.projectService.projectForm(project);
    this.additionalFieldForm.reset();
  }
}
