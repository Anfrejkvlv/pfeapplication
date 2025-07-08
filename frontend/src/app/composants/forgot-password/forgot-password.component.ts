import { Component, OnDestroy, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import { Subject, Subscription } from 'rxjs';
import { MatError, MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur/utilisateur.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpResponse } from '../../interface/custom-http-response';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatInputModule,MatError,ReactiveFormsModule,FormsModule, CommonModule,RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit,OnDestroy{
  refreshing: boolean=false;

  constructor(private service: UtilisateurService, private notif:ToastrService){}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete
  }
  ngOnInit(): void {
    this.form;
  }


    form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    public showLoading!: boolean;
    private destroy$= new Subject<void>();

      onResetPassword():void{
      this.refreshing=true;
      if(this.form.invalid) return;
      const email=this.form.get('email')?.value;
      this.service.resetPassword(email!).subscribe({
        next: (response:CustomHttpResponse | HttpErrorResponse)=>{
          this.form.reset();
          this.notif.success(response.message,"succès".toUpperCase());
          this.refreshing=false;
        },
        error:(err: HttpErrorResponse)=>{
          this.notif.error(err.error.message,err.error.reason);
          console.error("Une erreur est servenue, ",err.message);
          this.refreshing=false;
        }
      })
    }
}
