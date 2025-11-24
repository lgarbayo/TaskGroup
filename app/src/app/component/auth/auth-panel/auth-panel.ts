import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth-service';
import { LoginCommand, RegisterCommand } from '../../../model/auth.model';

@Component({
  selector: 'app-auth-panel',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-panel.html',
  styleUrl: './auth-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPanel {
  private authService = inject(AuthService);
  private nfb = inject(NonNullableFormBuilder);

  readonly user = this.authService.user;
  readonly isAuthenticated = computed(() => !!this.authService.token());

  readonly loginForm = this.nfb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly registerForm = this.nfb.group({
    alias: ['', [Validators.required]],
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly mode = signal<'login' | 'register'>('login');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  switchMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.errorMessage.set(null);
  }

  submitLogin(): void {
    this.normalizeLoginForm();
    if (this.loginForm.invalid || this.loading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload = this.loginForm.getRawValue() as LoginCommand;
    this.loading.set(true);
    this.authService.login(payload).subscribe({
      next: () => {
        this.errorMessage.set(null);
        this.loginForm.reset();
      },
      error: (error) => {
        console.error('Unable to login', error);
        this.errorMessage.set(this.resolveErrorMessage(error));
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  submitRegister(): void {
    this.normalizeRegisterForm();
    if (this.registerForm.invalid || this.loading()) {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set('Revisa los campos resaltados antes de continuar.');
      return;
    }

    const payload = this.registerForm.getRawValue() as RegisterCommand;
    this.loading.set(true);
    this.authService.register(payload).subscribe({
      next: () => {
        this.errorMessage.set(null);
        this.registerForm.reset();
      },
      error: (error) => {
        console.error('Unable to register', error);
        this.errorMessage.set(this.resolveErrorMessage(error));
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
        this.mode.set('login');
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.errorMessage.set(null);
    this.loginForm.reset();
    this.registerForm.reset();
  }

  private resolveErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      const err = error as { error?: { message?: string; errors?: Record<string, string[]> } };
      if (err.error?.message) {
        return err.error.message;
      }
      if (err.error?.errors) {
        const first = Object.values(err.error.errors)[0];
        if (first?.length) {
          return first[0];
        }
      }
    }
    return 'No pudimos procesar tu solicitud. Revisa los datos e inténtalo de nuevo.';
  }

  inputInvalid(controlName: keyof typeof this.registerForm.controls): boolean {
    const control = this.registerForm.controls[controlName];
    return control.invalid && control.touched;
  }

  private normalizeRegisterForm(): void {
    this.registerForm.patchValue(
      {
        alias: this.registerForm.controls.alias.value?.trim() ?? '',
        name: this.registerForm.controls.name.value?.trim() ?? '',
        email: this.registerForm.controls.email.value?.trim() ?? '',
        password: this.registerForm.controls.password.value ?? '',
      },
      { emitEvent: false }
    );
  }

  private normalizeLoginForm(): void {
    this.loginForm.patchValue(
      {
        email: this.loginForm.controls.email.value?.trim() ?? '',
        password: this.loginForm.controls.password.value ?? '',
      },
      { emitEvent: false }
    );
  }
}
