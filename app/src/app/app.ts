import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthService } from './service/auth-service';
import { TranslatePipe } from './i18n/translate.pipe';
import { TranslationService } from './i18n/translation.service';
import { LanguageCode } from './i18n/translations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { ContactTransitionService } from './service/contact-transition.service';
import { getAvatarColor, getAvatarInitial } from './model/auth.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TranslatePipe],
  templateUrl: './app.html'
})
export class App {
  private document = inject(DOCUMENT);
  private authService = inject(AuthService);
  private translation = inject(TranslationService);
  private router = inject(Router);
  private contactTransition = inject(ContactTransitionService);
  protected readonly title = signal('TaskGroup');
  protected readonly theme = signal<'light' | 'dark'>(App.loadTheme());
  protected readonly user = this.authService.user;
  protected readonly isAuthenticated = computed(() => !!this.authService.token());
  protected readonly language = this.translation.language;
  protected readonly languages = this.translation.supportedLanguages;
  protected readonly languageMenuOpen = signal(false);
  protected readonly currentUrl = signal(this.router.url);
  protected readonly isLoginRoute = computed(() => this.currentUrl().startsWith('/login'));
  protected readonly isLandingRoute = computed(() => this.currentUrl() === '/' || this.currentUrl() === '');
  protected readonly avatarInitial = getAvatarInitial;
  protected readonly avatarColor = getAvatarColor;

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

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  handleProjectsLink(event: Event): void {
    if (this.currentUrl().startsWith('/list')) {
      event.preventDefault();
      this.contactTransition.showProjects();
    }
  }

  handleContactLink(event: Event): void {
    event.preventDefault();
    this.contactTransition.showContact();
    if (!this.currentUrl().startsWith('/list')) {
      this.router.navigate(['/list']);
    }
  }

  toggleTheme(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleLanguageMenu(): void {
    this.languageMenuOpen.update((value) => !value);
  }

  changeLanguage(code: string): void {
    const lang = code as LanguageCode;
    if (lang === this.language()) return;
    this.translation.setLanguage(lang);
    this.languageMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) {
      this.languageMenuOpen.set(false);
      return;
    }
    if (!event.target.closest('.language-dropdown')) {
      this.languageMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.languageMenuOpen.set(false);
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
