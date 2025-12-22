import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { AuthService } from '../../service/auth-service';
import { TranslationService } from '../../i18n/translation.service';

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

  user = computed(() => this.auth.user());
  readonly loading = signal(false);
  readonly errorMessage = signal<{ key?: string; raw?: string } | null>(null);
  readonly successMessage = signal<string | null>(null);

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

  startEmailChange(): void {
    // Placeholder para el flujo de cambio de email
    console.info('Email change flow not implemented yet');
  }

  startPasswordChange(): void {
    // Placeholder para el flujo de cambio de contraseña
    console.info('Password change flow not implemented yet');
  }

  resendEmailVerification(): void {
    // Placeholder para reenviar correo de verificación
    console.info('Resend email verification not implemented yet');
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

  private resolveErrorMessage(error: unknown): { key?: string; raw?: string } {
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
    return { key: 'profile.update.error' };
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
