import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterModule, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterOutlet,MatToolbarModule,MatSidenavModule,MatIconModule,MatListModule,MatButtonModule,RouterModule,CommonModule,MatProgressSpinnerModule,RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{
isAdminEmp:boolean=false;
isAdmin:boolean=false;
constructor(private router:Router, private authService:AuthService, private notif:ToastrService, private shared: SharedService ){

}

 menuItems: any[] =[
    {
      icon:'home',
      label:'Home',
      route:'home'
    },
    {
      icon:'person',
      label:'Personne',
      route:'personnes',
      isVisible: this.isAdminEmp
    },
    {
      icon: 'person',
      label: 'Utilisateur',
      route:'utilisateurs',
      isVisible: this.isAdmin

    },
    {
      icon:'assignment',
      label:'Responsabilite',
      route:'responsabilities',
      isVisible: this.isAdminEmp
    },
    {
      icon:'star',
      label:'Grade',
      route:'grades',
      isVisible: this.isAdminEmp
    },
    {
      icon:'business',
      label:'Departement',
      route:'departements',
      isVisible: this.isAdmin
    }
    ,

    {
      icon:'help',
      label:'Change Password',
      route:'change'
    },
  ];
    isLoading = false;

  ngOnInit() {
  this.isAdminEmp=this.shared.isAdminAndEmp;
   this.isAdmin=this.shared.isAdmin;
    console.log("AdminEmp:",this.isAdminEmp);
    console.log("AdminEmp:",this.isAdminEmp);


    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    },10);
  }

  logout(): void {
    this.isLoading = true;
    this.authService.logout();
    this.notif.success("Vous avez été bien déconnecté","SUCCESS");
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }

  setting(){
    this.router.navigate(['account']);
  }


}
