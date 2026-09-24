import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
import { EncryptionService } from '../../core/services/encryptions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private encryptionService = inject(EncryptionService);
  private router = inject(Router);

  UserId = '';
  Password = '';

  showPassword = false;
  errorMessage = '';
  isLoading = false;

// CAPTCHA
captchaText = '';
captchaInput = '';

constructor() {
  this.generateCaptcha();
}

generateCaptcha(): void {
  // Characters that are easy to distinguish
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

  // Generate a random 5-character CAPTCHA
  this.captchaText = Array.from(
    { length: 5 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join('');

  // Clear the previous answer
  this.captchaInput = '';
}

onLogin(): void {debugger
  this.errorMessage = '';

  if (!this.UserId || !this.Password) {
    this.errorMessage = 'Please enter your user ID and password';
    return;
  }

  if (
    this.captchaInput.trim().toUpperCase() !== this.captchaText
  ) {
    this.errorMessage = 'Incorrect CAPTCHA. Please try again.';
    this.generateCaptcha();
    return;
  }

  this.isLoading = true;

  this.encryptionService
    .buildEncryptedLoginPayload(this.UserId, this.Password)
    .then((payload) => {
      this.authService.login(payload).subscribe({
        next: (response) => {
          this.isLoading = false;

          const status = response.Status ?? response.status;
          const token = response.Token ?? response.token;
          const message = response.Message ?? response.message;

          if (status && token) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = message || 'Login failed';
            this.generateCaptcha();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.Message ||
            error.error?.message ||
            'Unable to login. Please try again.';
          this.generateCaptcha();
        }
      });
    })
    .catch(() => {
      this.isLoading = false;
      this.errorMessage = 'Could not load security key. Please try again.';
    });
}
}