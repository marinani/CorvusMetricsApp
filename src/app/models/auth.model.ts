import { UserRole } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | '';
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number | null;
}