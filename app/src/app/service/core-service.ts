import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { DateType, DateTypeForm } from '../model/core.model';
import { TranslationService } from '../i18n/translation.service';
import { computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private nfb = inject(NonNullableFormBuilder);
  private translation = inject(TranslationService);
  readonly monthNames = computed(() =>
    this.monthKeys.map((key, index) => {
      const month = this.translation.translate(key);
      return !month || month === key ? `M${index + 1}` : month;
    })
  );
  private readonly monthKeys = [
    'date.month.january',
    'date.month.february',
    'date.month.march',
    'date.month.april',
    'date.month.may',
    'date.month.june',
    'date.month.july',
    'date.month.august',
    'date.month.september',
    'date.month.october',
    'date.month.november',
    'date.month.december',
  ];

  dateTypeForm(data?: DateType): DateTypeForm {
    const today = new Date();
    const currentYear = today.getFullYear();
    const baseYear = 2025;
    const initialYear = Math.max(data?.year ?? currentYear, baseYear);
    const minYear = baseYear;
    const maxYear = Math.max(initialYear, currentYear + 5);
    return this.nfb.group({
      year: [initialYear, [Validators.min(minYear), Validators.max(maxYear)]],
      month: [data?.month ?? today.getMonth(), [Validators.min(0), Validators.max(11)]],
      week: [data?.week ?? Math.min(Math.floor(today.getDate() / 8), 3), [Validators.min(0), Validators.max(3)]],
    });
  }

  formatDateLabel(date?: DateType | null): string {
    if (!date) {
      return '';
    }
    const monthIndex = typeof date.month === 'number' ? date.month : 0;
    const monthKey = this.monthKeys[monthIndex] ?? null;
    let month = monthKey ? this.translation.translate(monthKey) : '';
    if (!month || month === monthKey) {
      month = `M${monthIndex + 1}`;
    }
    const week = this.toDisplayWeek(date.week);
    const prefix = this.translation.language() === 'en' ? 'W' : 'S';
    return `${month} ${date.year} · ${prefix}${week}`;
  }

  toDisplayWeek(value?: number | null): number {
    return (value ?? 0) + 1;
  }

  toBackendWeek(displayValue: number): number {
    return Math.max(displayValue - 1, 0);
  }

  toBackendMonth(displayValue: number): number {
    return Math.max(displayValue - 1, 0);
  }

}
