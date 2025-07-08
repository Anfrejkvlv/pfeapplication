import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
    let ver=false;
    const authService=inject(AuthService);
    const notif=inject(ToastrService)
    const router=inject(Router);

    if (authService.isLoggedIn()) {
        return true; // connecté
    } else {
        // pas connecté
        if (state.url === '/login') {
            notif.error("Connectez-vous pour accéder à cette page".toUpperCase());
            return true; // autorisé à accès
        }

        // Vérifie si le token est expiré
        if (authService.isTokenExpired()) {
            notif.error("Votre session a expiré. Veuillez vous reconnecter.".toUpperCase());
            router.navigate(['login']); // Redirige vers la page de connexion
            return false; // Accès interdit
        }

        // Redirige vers la page de connexion pour toute autre route
        router.navigate(['login']);
        return false; // Accès interdit
    }
};
