import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);
    const router=inject(Router);
    const notif=inject(ToastrService);

  const nonSecurePaths = [
    '/user/login',
    '/user/register',
    '/user/resetPassword' //pas besoin de specifier le lien
  ];
  const isPublicRequest = nonSecurePaths.some(path => req.url.includes(path));
    if (isPublicRequest) return next(req);

    authService.loadToken();
    const token = authService.getToken();

    // Vérifie si le token existe et s'il est valide
    if (token && !authService.isTokenExpired()) {
        const request = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(request).pipe(
            catchError(err => {
                if (err.status === 401) {
                    // Redirige vers la page de connexion en cas de token invalide
                    notif.error("Votre session a expiré. Veuillez vous reconnecter.".toUpperCase());
                    router.navigate(['login']);
                }
                return throwError(err);
            })
        );
    }

    return next(req);
};
