import { Injectable, signal } from '@angular/core';

type TargetSection = 'projects' | 'contact' | null;

@Injectable({ providedIn: 'root' })
export class ContactTransitionService {
  private readonly target = signal<TargetSection>(null);

  readonly section = this.target.asReadonly();

  showContact(): void {
    this.target.set('contact');
  }

  showProjects(): void {
    this.target.set('projects');
  }

  clear(): void {
    this.target.set(null);
  }
}
