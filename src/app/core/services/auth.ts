import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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

export interface UserSession {
  userId: string;
  roleId: string;
  token?: string;
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

  private userSessionSubject = new BehaviorSubject<UserSession | null>(this.getInitialSession());
  public currentUser$ = this.userSessionSubject.asObservable();

  private getInitialSession(): UserSession | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || '';
      const userId = localStorage.getItem('UserId') || '';
      const roleId = (localStorage.getItem('RoleId') || '').trim().toUpperCase();
      if (token || userId || roleId) {
        return { userId, roleId, token };
      }
    }
    return null;
  }

  setSession(userId: string, roleId: string, token: string): void {
    const formattedRoleId = (roleId || '').trim().toUpperCase();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('token', token);
      localStorage.setItem('UserId', userId);
      localStorage.setItem('RoleId', formattedRoleId);
    }
    this.userSessionSubject.next({ userId, roleId: formattedRoleId, token });
  }

  getUserId(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('UserId') || '';
    }
    return '';
  }

  getRoleId(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('RoleId')?.trim().toUpperCase() || '';
    }
    return '';
  }

  getRoleDisplayName(roleId?: string): string {
    const role = (roleId || this.getRoleId()).trim().toUpperCase();
    switch (role) {
      case 'SADM':
        return 'State Admin';
      case 'DADM':
        return 'District Admin';
      case 'DOPT':
        return 'Scheme Operator';
      case 'HELP':
        return 'Helpdesk';
      default:
        return role ? role : 'User';
    }
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
      return !!(localStorage.getItem('accessToken') || localStorage.getItem('UserId') || localStorage.getItem('RoleId'));
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
    this.userSessionSubject.next(null);
  }
}