import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthPanel } from '../../component/auth/auth-panel/auth-panel';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [AuthPanel],
  templateUrl: './auth-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPage {}
