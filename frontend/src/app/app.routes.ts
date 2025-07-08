import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './composants/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './composants/change-password/change-password.component';
import { ListeDepartementComponent } from './composants/depatement/liste-departement/liste-departement.component';
import { ListeGradeComponent } from './composants/grade/liste-grade/liste-grade.component';
import { ListePersonneComponent } from './composants/personne/liste-personne/liste-personne.component';
import { DetailsProfesseurComponent } from './composants/professeur/details-professeur/details-professeur.component';
import { ListeResponsabilityComponent } from './composants/responsability/liste-responsability/liste-responsability.component';
import { LoginComponent } from './composants/login/login.component';
import { ListeAssumeeComponent } from './composants/responsability/liste-assumee/liste-assumee.component';
import { ListeUtilisateurComponent } from './composants/utilisateur/liste-utilisateur/liste-utilisateur.component';
import { NavBarComponent } from './composants/nav-bar/nav-bar.component';
import { authGuard } from './guard/auth.guard';
import { roleGuard } from './guard/role.guard';
import { AccountDetailComponent } from './dashboard/account-detail/account-detail.component';

export const routes: Routes = [

    {
        path:'login', component:LoginComponent
    },
  {path:'',canActivate: [authGuard] ,component: NavBarComponent, children:[
    {
        path:'home', component:DetailsProfesseurComponent,canActivate: [authGuard]
    },

    {
      path:'',redirectTo:'home',pathMatch:'full'
    },

    {
        path:'personnes', component:ListePersonneComponent,
        canActivate:[roleGuard],
        data:{expectedRole:'ROLE_ADMIN'}
    },
    {
      path: 'utilisateurs', component: ListeUtilisateurComponent,
        canActivate:[roleGuard],
        data:{expectedRole:['ROLE_ADMIN']}
    },
    {
        path:'responsabilities',component:ListeResponsabilityComponent,
        canActivate:[roleGuard],
        data:{expectedRole:['ROLE_ADMIN','ROLE_GESTIONNAIRE']}
    },
    {
        path:'grades', component:ListeGradeComponent,
        canActivate:[roleGuard],
        data:{expectedRole:['ROLE_ADMIN','ROLE_GESTIONNAIRE']}
    },
    {
        path:'departements', component:ListeDepartementComponent,
        canActivate:[roleGuard],
        data:{expectedRole:['ROLE_ADMIN','ROLE_GESTIONNAIRE']}
    },
    {
        path:'change', component:ChangePasswordComponent,
    }
    ,
    {
        path:'details-professeur/:code', component:ListeAssumeeComponent
    },
    {
      path:'account',component: AccountDetailComponent
    }
  ]},
    {
        path:'forgot', component:ForgotPasswordComponent
    },
    {
        path:'**',
        redirectTo:'login',
        ///pathMatch:'full'
    },

];
