import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Ne dodavaj token na auth endpointe  oni ne trebaju token
  const isAuthEndpoint = req.url.includes('/api/auth/');

  const clonedReq = (token && !isAuthEndpoint) ? req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  }) : req;

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ako je token istekao, odjavi usera i pošalji na login
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};