import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,MatProgressSpinnerModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Front-PFE';
initialCheckDone = false;
  isLoading: boolean=false;
 /*
  constructor(private authService: AuthService, private router: Router, private notif: ToastrService,private cdr: ChangeDetectorRef) {
    setTimeout(() => {
      this.isLoading = true;
      this.cdr.detectChanges();
    }, 0);
  }

   ngOnInit() {
    // Vérification initiale de l'authentification
    const isAuthenticated = this.authService.isLoggedIn();

    if (isAuthenticated) {
      // Si authentifié, on navigue vers la page demandée après un court délai
      setTimeout(() => {
        this.initialCheckDone = true;
      }, 100);
    } else {
      // Si non authentifié, on redirige immédiatement vers login
      setTimeout(() => {
      this.notif.error("Connectez-vous pour acceder a cette page".toUpperCase());
      this.router.navigate(['/login']);
      this.initialCheckDone = true;},100);
    }
  }*/
}
