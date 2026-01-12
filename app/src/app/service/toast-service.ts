import { Injectable, WritableSignal, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastMessage {
  key?: string;
  message?: string;
  kind: ToastKind;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSignal: WritableSignal<ToastMessage | null> = signal<ToastMessage | null>(null);
  private timeoutId: number | null = null;

  readonly toast = this.toastSignal.asReadonly();

  show(toast: ToastMessage, durationMs = 2800): void {
    this.toastSignal.set(toast);
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.toastSignal.set(null);
      this.timeoutId = null;
    }, durationMs);
  }

  showSuccess(key: string, durationMs?: number): void {
    this.show({ key, kind: 'success' }, durationMs);
  }

  dismiss(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.toastSignal.set(null);
  }
}
