import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../api/api.config';
import { EncryptionService, EncryptedLoginPayload } from './encryptions';

export interface LoginResponse {
  status?: boolean;
  token?: string;
  message?: string;
  clientKey?: string;
  roleId?: string;

  Status?: boolean;
  Token?: string;
  Message?: string;
  ClientKey?: string;
  RoleId?: string;
}

export type RoleCode = 'SADM' | 'DADM' | 'DOPT' | 'HELP';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly encryption = inject(EncryptionService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly apiUrl = API_BASE_URL;


  getRoleId(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('RoleId')?.trim().toUpperCase() || '';
    }
    return '';
  }

  login(credentials: EncryptedLoginPayload): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        credentials
      )
      .pipe(
        tap((response: LoginResponse) => {

          const status = response.Status ?? response.status;
          const token = response.Token ?? response.token;

          if (status && token) {

            // Store token
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('accessToken', token);
            }

            // Get server AES key
            const serverKey =
              response.ClientKey ?? response.clientKey;

            if (serverKey) {
              this.encryption.setSessionKey(serverKey);
            }
          }
        })
      );
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      localStorage.removeItem('UserId');
      localStorage.removeItem('RoleId');
    }

    this.encryption.clearSessionKey();
  }
}