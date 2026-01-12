import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { AuthService } from '../../service/auth-service';
import { TranslationService } from '../../i18n/translation.service';
import { AuthUserStats, getAvatarColor, getAvatarInitial } from '../../model/auth.model';
import { ToastService } from '../../service/toast-service';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './user-profile-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfilePage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private nfb = inject(NonNullableFormBuilder);
  private translation = inject(TranslationService);
  private toast = inject(ToastService);

  user = computed(() => this.auth.user());
  readonly loading = signal(false);
  readonly errorMessage = signal<{ key?: string; raw?: string } | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly stats = signal<AuthUserStats | null>(null);
  readonly statsLoading = signal(false);
  readonly statsError = signal<string | null>(null);
  readonly emailModalOpen = signal(false);
  readonly emailLoading = signal(false);
  readonly emailError = signal<{ key?: string; raw?: string } | null>(null);
  readonly emailSuccess = signal<string | null>(null);
  readonly passwordModalOpen = signal(false);
  readonly passwordLoading = signal(false);
  readonly passwordError = signal<{ key?: string; raw?: string } | null>(null);
  readonly passwordSuccess = signal<string | null>(null);

  readonly timezones: string[] = (() => {
    const intl = Intl as unknown as { supportedValuesOf?: (key: string) => readonly string[] };
    try {
      if (typeof intl.supportedValuesOf === 'function') {
        return [...intl.supportedValuesOf('timeZone')].sort();
      }
    } catch {
      // ignore and fall back
    }
    return [
      'UTC',
      'Europe/Madrid',
      'Europe/London',
      'Europe/Paris',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Sao_Paulo',
      'America/Bogota',
      'America/Mexico_City',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Hong_Kong',
      'Asia/Singapore',
      'Asia/Kolkata',
      'Asia/Dubai',
      'Australia/Sydney',
      'Pacific/Auckland',
    ].sort();
  })();

  readonly form = this.nfb.group({
    alias: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    name: [''],
    timezone: [UserProfilePage.getInitialTimezone(), [Validators.required]],
  });

  readonly emailForm = this.nfb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.nfb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirmation: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.form.patchValue(
          {
            alias: currentUser.alias,
            name: currentUser.name ?? '',
          },
          { emitEvent: false }
        );
      } else {
        this.form.reset();
      }
    });

    this.loadUserStats();
  }


  goBack(): void {
    this.router.navigate(['/list']);
  }

  readonly passwordLastUpdatedLabel = computed(() => {
    const currentUser = this.user();
    const raw = currentUser?.updatedAt;
    if (!raw) {
      return '';
    }
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const lang = this.translation.language();
    const locale = lang === 'es' ? 'es-ES' : lang === 'gl' ? 'gl-ES' : 'en-US';
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
  });

  readonly avatarInitial = computed(() => getAvatarInitial(this.user()));

  readonly avatarColor = computed(() => getAvatarColor(this.user()));

  startEmailChange(): void {
    const currentEmail = this.user()?.email ?? '';
    this.emailForm.reset({ email: currentEmail });
    this.emailError.set(null);
    this.emailSuccess.set(null);
    this.emailModalOpen.set(true);
  }

  startPasswordChange(): void {
    this.passwordForm.reset({
      currentPassword: '',
      password: '',
      passwordConfirmation: '',
    });
    this.passwordError.set(null);
    this.passwordSuccess.set(null);
    this.passwordModalOpen.set(true);
  }

  resendEmailVerification(): void {
    // Placeholder para reenviar correo de verificación
    console.info('Resend email verification not implemented yet');
  }

  closePasswordModal(): void {
    if (this.passwordLoading()) {
      return;
    }
    this.passwordModalOpen.set(false);
    this.passwordError.set(null);
    this.passwordSuccess.set(null);
  }

  submitPasswordChange(): void {
    if (this.passwordForm.invalid || this.passwordLoading()) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const value = this.passwordForm.getRawValue();
    if (value.password !== value.passwordConfirmation) {
      this.passwordForm.controls.passwordConfirmation.setErrors({ mismatch: true });
      this.passwordForm.controls.passwordConfirmation.markAsTouched();
      return;
    }

    this.passwordLoading.set(true);
    this.passwordError.set(null);
    this.passwordSuccess.set(null);

    this.auth.updatePassword(value).subscribe({
      next: () => {
        this.passwordSuccess.set('profile.password.update.success');
        this.passwordModalOpen.set(false);
        this.toast.showSuccess('profile.password.update.success');
      },
      error: (error) => {
        console.error('Unable to update password', error);
        this.passwordError.set(this.resolveErrorMessage(error, 'profile.password.update.error'));
        this.passwordLoading.set(false);
      },
      complete: () => {
        this.passwordLoading.set(false);
      },
    });
  }

  closeEmailModal(): void {
    if (this.emailLoading()) {
      return;
    }
    this.emailModalOpen.set(false);
    this.emailError.set(null);
    this.emailSuccess.set(null);
  }

  submitEmailChange(): void {
    if (this.emailForm.invalid || this.emailLoading()) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const value = this.emailForm.getRawValue();
    const email = value.email.trim().toLowerCase();
    if (!email) {
      this.emailForm.controls.email.setValue('');
      this.emailForm.markAllAsTouched();
      return;
    }

    this.emailLoading.set(true);
    this.emailError.set(null);
    this.emailSuccess.set(null);

    this.auth.updateEmail({ email }).subscribe({
      next: () => {
        this.emailSuccess.set('profile.email.update.success');
        this.emailModalOpen.set(false);
        this.toast.showSuccess('profile.email.update.success');
      },
      error: (error) => {
        console.error('Unable to update email', error);
        this.emailError.set(this.resolveErrorMessage(error, 'profile.email.update.error'));
        this.emailLoading.set(false);
      },
      complete: () => {
        this.emailLoading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.auth
      .updateProfile({
        alias: value.alias.trim(),
        name: value.name?.trim() || null,
      })
      .subscribe({
        next: () => {
          const tz = value.timezone;
          if (tz) {
            if (typeof window !== 'undefined') {
              window.localStorage?.setItem('taskgroup_timezone', tz);
            }
          }
          this.successMessage.set('profile.update.success');
        },
        error: (error) => {
          console.error('Unable to update profile', error);
          this.errorMessage.set(this.resolveErrorMessage(error));
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  inputInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

  emailInputInvalid(): boolean {
    const control = this.emailForm.controls.email;
    return control.invalid && control.touched;
  }

  passwordInputInvalid(controlName: keyof typeof this.passwordForm.controls): boolean {
    const control = this.passwordForm.controls[controlName];
    return control.invalid && control.touched;
  }

  private resolveErrorMessage(error: unknown, fallbackKey = 'profile.update.error'): { key?: string; raw?: string } {
    if (typeof error === 'string') {
      return { raw: error };
    }
    if (error && typeof error === 'object') {
      const err = error as { error?: { message?: string; errors?: Record<string, string[]> } };
      if (err.error?.message) {
        return { raw: err.error.message };
      }
      if (err.error?.errors) {
        const first = Object.values(err.error.errors)[0];
        if (first?.length) {
          return { raw: first[0] };
        }
      }
    }
    return { key: fallbackKey };
  }

  private loadUserStats(): void {
    this.statsLoading.set(true);
    this.statsError.set(null);

    this.auth.getUserStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: (error) => {
        console.error('Unable to load user stats', error);
        this.statsError.set('profile.stats.error');
        this.statsLoading.set(false);
      },
      complete: () => {
        this.statsLoading.set(false);
      },
    });
  }

  private static getInitialTimezone(): string {
    let stored: string | null = null;
    if (typeof window !== 'undefined') {
      stored = window.localStorage?.getItem('taskgroup_timezone') ?? null;
    }
    if (stored) {
      return stored;
    }
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Europe/Madrid';
    } catch {
      return 'Europe/Madrid';
    }
  }
}
