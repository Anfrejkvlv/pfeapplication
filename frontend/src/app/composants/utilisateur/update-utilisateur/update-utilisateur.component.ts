import { CommonModule } from '@angular/common';
import {  Component, Inject } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Utilisateur } from '../../../interface/utilisateur.interface';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-update-utilisateur',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogClose,
    ReactiveFormsModule, MatFormFieldModule,
    CommonModule, MatInputModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatCardModule
  ],
  templateUrl: './update-utilisateur.component.html',
  styleUrl: './update-utilisateur.component.css'
})
export class UpdateUtilisateurComponent {
    private destroy$= new Subject<void>();
    private isLoading = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoading.asObservable();

    constructor(private service: UtilisateurService,public dialogRef: MatDialogRef<UpdateUtilisateurComponent>,@Inject(MAT_DIALOG_DATA) public data: { currentCode: string },private notif: ToastrService){
    }
      ngOnInit(): void {
      this.loadCurrentData();
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
      role: new FormControl('', Validators.required),
      prenom: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateNaissance: new FormControl<string | null>(null, Validators.required),
      sexe: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      notLocked: new FormControl<boolean>(false,Validators.required)
    });

  private loadCurrentData(): void {
        this.service.getOne(this.data.currentCode).subscribe({
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
            notLocked: resp.notLocked,

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
      this.isLoading.next(true);
      this.service.update(this.data.currentCode, this.updateForm.value as Utilisateur).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.notif.success("Utilisateur mis à jour","SUCCESS");
          this.updateForm.reset();
          this.isLoading.next(false);

        },
        error: (err:HttpErrorResponse) => {
          console.error(err)
          this.notif.error(err.error.message)
          this.isLoading.next(true);
        }
      });
    }
}
