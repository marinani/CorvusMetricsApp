import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../services/toast/toast.service';

const LOGIN_ENDPOINT = '/auth/login';

export function apiInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const token = authService.getToken();
  const authenticatedRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const isLoginRequest = authenticatedRequest.url.includes(LOGIN_ENDPOINT);

        if (!isLoginRequest && authService.isAuthenticated()) {
          authService.logout();
          toast.warning('Your session has expired. Please sign in again.');
          void router.navigate(['/login']);
        }
      }

      throw error;
    })
  );
}
