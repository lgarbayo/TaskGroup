import { Injectable, signal, WritableSignal } from '@angular/core';
import { FALLBACK_LANGUAGE, LanguageCode, SUPPORTED_LANGUAGES, TRANSLATIONS } from './translations';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  readonly supportedLanguages = SUPPORTED_LANGUAGES;
  private readonly storageKey = 'taskgroup_language';
  private readonly languageSignal: WritableSignal<LanguageCode> = signal<LanguageCode>(
    this.getInitialLanguage()
  );

  constructor() {}

  language = this.languageSignal.asReadonly();

  setLanguage(code: LanguageCode): void {
    if (!TRANSLATIONS[code]) {
      return;
    }
    this.languageSignal.set(code);
    this.getStorage()?.setItem(this.storageKey, code);
  }

  translate(key: string, params?: Record<string, string | number>): string {
    if (!key) return '';
    const lang = this.languageSignal();
    const dictionary = TRANSLATIONS[lang] ?? {};
    const fallbackDictionary = TRANSLATIONS[FALLBACK_LANGUAGE];
    const template = dictionary[key] ?? fallbackDictionary[key] ?? key;

    return this.interpolate(template, params);
  }

  private interpolate(template: string, params?: Record<string, string | number>): string {
    if (!params) {
      return template;
    }
    return Object.keys(params).reduce((result, paramKey) => {
      const value = params[paramKey];
      return result.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(value));
    }, template);
  }

  private getInitialLanguage(): LanguageCode {
    const browserLanguage = this.getBrowserLanguage();
    if (browserLanguage) {
      return browserLanguage;
    }
    const storageValue = this.getStorage()?.getItem(this.storageKey);
    if (storageValue && TRANSLATIONS[storageValue as LanguageCode]) {
      return storageValue as LanguageCode;
    }
    return FALLBACK_LANGUAGE;
  }

  private getStorage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage;
  }

  private getBrowserLanguage(): LanguageCode | null {
    if (typeof navigator === 'undefined') {
      return null;
    }
    const supported = new Set(this.supportedLanguages.map((lang) => lang.code));
    const candidates = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    for (const candidate of candidates) {
      if (!candidate) continue;
      const normalized = candidate.toLowerCase();
      const base = normalized.split('-')[0] as LanguageCode;
      if (supported.has(normalized as LanguageCode)) {
        return normalized as LanguageCode;
      }
      if (supported.has(base)) {
        return base;
      }
    }
    return null;
  }
}
