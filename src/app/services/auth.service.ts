import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiService } from '../core/services/api/api.service';
import { decodeJwtPayload } from '../core/utils/jwt.util';
import { AuthSession, AuthUser, LoginRequest } from '../models/auth.model';

const TOKEN_KEY = 'corvus_access_token';
const USER_KEY = 'corvus_auth_user';

const CLAIM_ALIASES: Record<keyof Omit<AuthUser, 'role'> | 'role', string[]> = {
  id: ['sub', 'nameid', 'id', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
  email: ['email', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
  firstName: ['given_name', 'firstName', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
  lastName: ['family_name', 'lastName', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
  role: ['role', 'roles', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userSignal = signal<AuthUser | null>(this.readStoredUser());

  readonly isAuthenticated = computed(() => this.token() !== null);
  readonly user = this.userSignal.asReadonly();

  login(credentials: LoginRequest): Observable<AuthSession> {
    return this.api.post<unknown>('/auth/login', credentials).pipe(
      map((response) => this.buildSession(response, credentials.email))
    );
  }

  setSession(session: AuthSession): void {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    this.token.set(session.token);
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

  private buildSession(response: unknown, fallbackEmail: string): AuthSession {
    const token = this.extractToken(response);
    const claims = decodeJwtPayload<Record<string, unknown>>(token) ?? {};

    const user: AuthUser = {
      id: this.pickClaim(claims, CLAIM_ALIASES.id) ?? '',
      email: this.pickClaim(claims, CLAIM_ALIASES.email) ?? fallbackEmail,
      firstName: this.pickClaim(claims, CLAIM_ALIASES.firstName) ?? '',
      lastName: this.pickClaim(claims, CLAIM_ALIASES.lastName) ?? '',
      role: (this.pickClaim(claims, CLAIM_ALIASES.role) as AuthUser['role']) ?? '',
    };

    const exp = claims['exp'];
    const expiresAt = typeof exp === 'number' ? exp * 1000 : null;

    return { token, user, expiresAt };
  }

  private extractToken(response: unknown): string {
    if (typeof response === 'string') {
      return response;
    }

    if (response && typeof response === 'object') {
      const source = response as Record<string, unknown>;
      const candidate = source['token'] ?? source['accessToken'] ?? source['access_token'] ?? source['jwt'];

      if (typeof candidate === 'string') {
        return candidate;
      }
    }

    throw new Error('Unexpected login response received from the API.');
  }

  private pickClaim(claims: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
      const value = claims[key];

      if (typeof value === 'string') {
        return value;
      }

      if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0];
      }
    }

    return undefined;
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