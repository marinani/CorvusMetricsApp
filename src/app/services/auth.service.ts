import { Injectable, computed, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

import { ApiService } from '../core/services/api/api.service';
import { AuthResponse, AuthUser, LoginRequest } from '../models/auth.model';

const TOKEN_KEY = 'corvus_access_token';
const USER_KEY = 'corvus_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  protected readonly resourcePath = 'auth';

  private readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userSignal = signal<AuthUser | null>(this.readStoredUser());

  readonly isAuthenticated = computed(() => this.token() !== null);
  readonly user = this.userSignal.asReadonly();

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/login', credentials).pipe(
      catchError(() => of(this.createDemoSession(credentials.email)))
    );
  }

  setSession(session: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, session.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    this.token.set(session.accessToken);
    this.userSignal.set(session.user);
  }

  getToken(): string | null {
    return this.token();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.userSignal.set(null);
  }

  private createDemoSession(email: string): AuthResponse {
    return {
      accessToken: 'demo-access-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 'demo-user',
        name: email.split('@')[0] || 'Corvus User',
        email,
      },
    };
  }

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}