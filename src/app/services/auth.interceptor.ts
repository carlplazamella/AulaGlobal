import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.token;

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401 && !req.url.includes('/auth/login')) {
        console.warn('🔐 Error 401 detectado. El usuario no está autorizado.');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
