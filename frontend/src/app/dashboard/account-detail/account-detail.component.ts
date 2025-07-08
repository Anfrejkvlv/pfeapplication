import { CommonModule } from '@angular/common';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { Utilisateur } from '../../interface/utilisateur.interface';
import { UtilisateurService } from '../../services/utilisateur/utilisateur.service';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [        FormsModule,
          MatButton,
          ReactiveFormsModule,MatFormFieldModule,
          CommonModule,MatInputModule,MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatSelectModule, MatCardModule],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.css'
})
export class AccountDetailComponent implements OnInit, OnDestroy{
   private destroy$= new Subject<void>();
    private isLoading = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoading.asObservable();
  isAdmin!: boolean;
    constructor(private service: UtilisateurService,private notif: ToastrService, private shared:AuthService, public share:SharedService , private router: Router){

    }
      ngOnInit(): void {

      this.loadCurrentData();
      this.isAdmin= this.share.isAdmin;
      this.updateForm;
      }

      ngOnDestroy(): void {
          this.destroy$.next();
          this.destroy$.complete();
      }

    updateForm = new FormGroup({
      cin: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z0-9]{5,8}$/)
      ]),
      nom: new FormControl('', Validators.required),
      role: new FormControl({value:'', disabled:!this.isAdmin}, Validators.required),
      prenom: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateNaissance: new FormControl<string | null>(null, Validators.required),
      sexe: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
    });

  private loadCurrentData(): void {
    const user=this.shared.getUserFromLocalCahe();
        this.service.getOne(user!.username).subscribe({
          next:(resp) => {
          this.updateForm.patchValue({
            cin: resp.cin,
            nom: resp.nom,
            prenom: resp.prenom,
            email: resp.email,
            dateNaissance: resp.dateNaissance,
            telephone: resp.telephone,
            sexe: resp.sexe,
            role: resp.role,
          });
        },
        error:(err)=>{
          console.error("Problème lors du chargement, ",err)
        }
        }

    );
      }


    onUpdateSubmit(): void {
    if (this.updateForm.invalid) return;
        const user=this.shared.getUserFromLocalCahe();
        this.updateForm.value.role=user?.role;
      this.isLoading.next(true);
      this.service.update(user!.username, this.updateForm.value as Utilisateur).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response:Utilisateur) => {
          //console.log("ROLE_ENTREE",response.role)
          this.notif.success("Données mise à jour".toUpperCase(),"SUCCESS");
          this.router.navigate(['/home']);
          this.updateForm.reset();
          this.isLoading.next(false);

        },
        error: (err) => {
          console.error(err)
          this.isLoading.next(true);
        }
      });
    }
}
