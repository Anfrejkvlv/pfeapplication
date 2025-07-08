import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService=inject(AuthService);
  const shared=inject(SharedService);
  const notif=inject(ToastrService)
  const router=inject(Router);


  const expectedRole= route.data['expectedRole'];
  const userRole=shared.getUserRole();

  if(!expectedRole.includes(userRole) ){
    router.navigate(['home']);
    return false;
  }
  return true;
};
