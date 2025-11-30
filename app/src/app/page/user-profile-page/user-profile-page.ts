import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './user-profile-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfilePage {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.auth.user());

  goBack(): void {
    this.router.navigate(['/list']);
  }
}
