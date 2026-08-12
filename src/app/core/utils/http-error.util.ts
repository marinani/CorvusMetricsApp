import { HttpErrorResponse } from '@angular/common/http';

interface ApiProblemDetails {
  title?: string;
  detail?: string;
}

export function resolveApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Unable to reach the server. Please check your connection and try again.';
    }

    const problem = error.error as ApiProblemDetails | null;

    if (problem?.detail) {
      return problem.detail;
    }

    if (problem?.title) {
      return problem.title;
    }
  }

  return fallback;
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 401;
}