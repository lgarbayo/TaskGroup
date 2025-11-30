import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { DateType, DateTypeForm } from '../model/core.model';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private nfb = inject(NonNullableFormBuilder);
  readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  dateTypeForm(data?: DateType): DateTypeForm {
    const today = new Date();
    const currentYear = today.getFullYear();
    const initialYear = data?.year ?? currentYear;
    const minYear = Math.min(initialYear, currentYear - 5);
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
    const month = this.monthNames[monthIndex] ?? `M${monthIndex + 1}`;
    const week = this.toDisplayWeek(date.week);
    return `${month} ${date.year} · W${week}`;
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
