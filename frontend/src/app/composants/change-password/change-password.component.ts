import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import { ReactiveFormsModule, FormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur/utilisateur.service';
import { Subject } from 'rxjs';
import { CustomHttpResponse } from '../../interface/custom-http-response';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
        MatInputModule,MatError,ReactiveFormsModule,FormsModule, CommonModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {


  refreshing: boolean=false;

    constructor(private service: UtilisateurService, private authService: AuthService, private notif:ToastrService,private router:Router){}

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete
    }
    ngOnInit(): void {
      //this.form;
    }


      form = new FormGroup({
        password: new FormControl('', [Validators.required]),
        oldPassword: new FormControl('', [Validators.required]),
      });

      public showLoading!: boolean;
      private destroy$= new Subject<void>();

        onResetPassword():void{
        this.refreshing=true;
        const username=this.authService.getUserFromLocalCahe()?.username;
        if(this.form.invalid) return;
        const oldPassword=this.form.get('oldPassword')?.value;
        const password=this.form.get('password')?.value;

        console.log("OPWD:",oldPassword,"{NEW : ",password);
        this.service.chagePassword(username!,oldPassword!,password!).subscribe({
          next: (response:CustomHttpResponse | HttpErrorResponse)=>{
            this.notif.success("Un email vous a été envoyer avec le nouveau mot de passe".toUpperCase(),"SUCCESS");
            this.router.navigate(['/home']);
            this.form.reset();
            this.refreshing=false;
          },
          error:(err: HttpErrorResponse)=>{
            console.error("Une erreur est servenue, ",err);
            this.notif.error("VOTRE MOT DE PASSE NE CORRESPOND, VEUILLEZ RESAISIR",err.error.reason);
            this.refreshing=false;
          }
        })
      }
}
