import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormField, email, form, minLength, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

import { resolveApiErrorMessage } from '../../../core/utils/http-error.util';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly credentials = signal({
    email: '',
    password: '',
  });

  protected readonly loginForm = form(this.credentials, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 6, { message: 'Password must be at least 6 characters' });
  });

  protected readonly hidePassword = signal(true);
  protected readonly rememberMe = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    if (this.authService.isAuthenticated()) {
      void this.router.navigate(['/dashboard']);
    }
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  protected onSubmit(): void {
    submit(this.loginForm, async () => {
      this.isSubmitting.set(true);
      this.errorMessage.set('');

      try {
        const session = await firstValueFrom(this.authService.login(this.credentials()));
        this.authService.setSession(session);
        await this.router.navigate(['/dashboard']);
      } catch (error) {
        this.errorMessage.set(resolveApiErrorMessage(error, 'Invalid email or password.'));
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }
}