import { Injectable, inject } from '@angular/core';
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

  private readonly apiUrl = API_BASE_URL;

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
            localStorage.setItem('accessToken', token);

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
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('UserId');
    localStorage.removeItem('RoleId');

    this.encryption.clearSessionKey();
  }
}