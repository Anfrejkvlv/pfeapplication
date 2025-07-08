import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Utilisateur } from '../../interface/utilisateur.interface';
import { HeaderType } from '../../enumeration/header-type.enum';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, MatFormFieldModule,MatInputModule,ReactiveFormsModule, FormsModule,MatLabel,MatError,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    loginData = {
    username: '',
    password: ''
  };

   hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  looad(res:boolean):boolean{
    setTimeout(() => {
     this.showLoading=res;
    }, 500);
    return this.showLoading;
  }


  public showLoading!: boolean;
  private subscription: Subscription[]=[];
  private destroy$= new Subject<void>();



  constructor(private router:Router, private authService:AuthService, private notif:ToastrService,private cdr: ChangeDetectorRef){}


  ngOnInit(): void {
        this.form;
  }

    form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });


    onLogin(): void {
    if(this.form.invalid) return;
    this.showLoading=true;
      this.authService.login(this.form.value as Utilisateur).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response:HttpResponse<any>) => {
          const token=response.headers.get(HeaderType.JWT_TOKEN);
          this.authService.saveToken(token!);

          const userData=response.body.user;

          this.authService.addUserToLocalCache(userData);
          console.log("LE ROLE:",this.authService.getUserFromLocalCahe()?.role)
          this.router.navigateByUrl('/home').then(()=>{
          this.showLoading=false;
          this.form.reset();
          this.cdr.detectChanges();
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.notif.error(err.error.message,err.error.reason);
          this.showLoading=false;
        }
      });
  }

  public onLogin1(user:Utilisateur):void{
    console.log(user);
    this.showLoading = true;
    this.subscription.push(
      this.authService.login(user).subscribe(

        (response : HttpResponse<Utilisateur>) => {
          const token= response.headers.get(HeaderType.JWT_TOKEN);
          this.authService.saveToken(token!);
          this.authService.addUserToLocalCache(response.body!);
          this.router.navigateByUrl('/home');
          this.showLoading=false;
        },
        (errorResponse: HttpErrorResponse)=>{
          this.showLoading=false;
          console.log(errorResponse)


        }
      )
    )
  }



    ngOnDestroy(): void {
          this.subscription.forEach(sub=> sub.unsubscribe());
          this.destroy$.next();
          this.destroy$.complete();
  }
}


