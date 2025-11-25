import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthPanel } from './component/auth/auth-panel/auth-panel';
import { AuthService } from './service/auth-service';
import { TranslatePipe } from './i18n/translate.pipe';
import { TranslationService } from './i18n/translation.service';
import { LanguageCode } from './i18n/translations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AuthPanel, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private document = inject(DOCUMENT);
  private authService = inject(AuthService);
  private translation = inject(TranslationService);

  protected readonly title = signal('TaskGroup');
  protected readonly theme = signal<'light' | 'dark'>(App.loadTheme());
  protected readonly user = this.authService.user;
  protected readonly isAuthenticated = computed(() => !!this.authService.token());
  protected readonly language = this.translation.language;
  protected readonly languages = this.translation.supportedLanguages;

  constructor() {
    effect(() => {
      const current = this.theme();
      this.document.documentElement.setAttribute('data-theme', current);
      try {
        localStorage.setItem('app-theme', current);
      } catch (err) {
        console.warn('Unable to store theme preference', err);
      }
    });
  }

  toggleTheme(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
  }

  logout(): void {
    this.authService.logout();
  }

  changeLanguage(code: string): void {
    const lang = code as LanguageCode;
    if (lang === this.language()) return;
    this.translation.setLanguage(lang);
  }

  private static loadTheme(): 'light' | 'dark' {
    try {
      const value = localStorage.getItem('app-theme');
      if (value === 'dark' || value === 'light') {
        return value;
      }
    } catch {
      // ignore
    }
    return 'light';
  }
}
