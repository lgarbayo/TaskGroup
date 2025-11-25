import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private translation = inject(TranslationService);

  transform(key: string | null | undefined, params?: Record<string, string | number>): string {
    this.translation.language();
    if (!key) {
      return '';
    }
    return this.translation.translate(key, params);
  }
}
