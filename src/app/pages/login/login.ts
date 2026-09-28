import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);

  UserId = '';
  Password = '';
  roleId = '';
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  captchaText = '';
  captchaInput = '';

  constructor() {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    this.captchaText = Array.from(
      { length: 5 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join('');
    this.captchaInput = '';
  }

  async onLogin(): Promise<void> {
    this.errorMessage = '';

    if (!this.UserId || !this.Password) {
      this.errorMessage = 'Please enter your user ID and password';
      return;
    }

    if (this.captchaInput.trim().toUpperCase() !== this.captchaText) {
      this.errorMessage = 'Incorrect CAPTCHA. Please try again.';
      this.generateCaptcha();
      return;
    }

    this.isLoading = true;

    try {
      const payload = await this.encryptionService.buildEncryptedLoginPayload(
        this.UserId,
        this.Password
      );

      this.authService.login(payload).subscribe({
        next: async (response) => {
          try {
            const status = response.Status ?? response.status;
            const token = response.Token ?? response.token;
            const message = response.Message ?? response.message;
            const encryptedRoleId = response.RoleId ?? response.roleId;

            if (!status || !token || !encryptedRoleId) {
              this.isLoading = false;
              this.errorMessage = message || 'Login failed';
              this.generateCaptcha();
              return;
            }

            const decryptedRoleId = await this.encryptionService.decryptField(encryptedRoleId);
            this.roleId = decryptedRoleId;

            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('accessToken', token);
              localStorage.setItem('token', token);
              localStorage.setItem('UserId', this.UserId);
              localStorage.setItem('RoleId', decryptedRoleId);
            }

            // Role Wise Redirection
            // switch (decryptedRoleId) {
            //   case 'SADM':
            //     this.router.navigate(['/dashboard']);
            //     break;

            //   case 'DADM':
            //   case 'DOPT':
            //   case 'HELP':
            //     this.router.navigate(['/reports/scheme-wise']);
            //     break;

            //   default:
            //     if (isPlatformBrowser(this.platformId)) {
            //       localStorage.clear();
            //     }
            //     this.errorMessage = 'Invalid role assigned to user.';
            //     this.generateCaptcha();
            //     break;
             switch (decryptedRoleId) {
              case 'SADM':
                this.router.navigate(['/dashboard']);
                break;

              case 'DADM':
              case 'DOPT':
              case 'HELP':
                this.router.navigate(['/reports/scheme-wise']);
                break;

              default:
                if (isPlatformBrowser(this.platformId)) {
                  localStorage.clear();
                }
                this.errorMessage = 'Invalid role assigned to user.';
                this.generateCaptcha();
                break;
            }

          } catch (error) {
            console.error('Role decryption failed:', error);
            this.errorMessage = 'Unable to verify user role.';
            this.generateCaptcha();
          } finally {
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.Message || error.error?.message || 'Unable to login. Please try again.';
          this.generateCaptcha();
        }
      });

    } catch (error) {
      console.error('Login encryption failed:', error);
      this.isLoading = false;
      this.errorMessage = 'Could not load security key. Please try again.';
      this.generateCaptcha();
    }
  }
}