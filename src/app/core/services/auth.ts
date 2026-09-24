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
  Status?: boolean;
  Token?: string;
  Message?: string;
  ClientKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly encryption = inject(EncryptionService);

  private readonly apiUrl = API_BASE_URL;

 
  login(credentials: EncryptedLoginPayload): Observable<LoginResponse> {debugger
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
            localStorage.setItem('accessToken', token);

            const serverKey = response.ClientKey ?? response.clientKey;
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
    this.encryption.clearSessionKey();
  }
}