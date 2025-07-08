import { CommonModule } from '@angular/common';
import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur.service';
import { Subject, takeUntil } from 'rxjs';
import { Utilisateur } from '../../../interface/utilisateur.interface';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-utilisateur',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatSelectModule,MatCardModule
    ],
  templateUrl: './add-utilisateur.component.html',
  styleUrl: './add-utilisateur.component.css'
})
export class AddUtilisateurComponent implements OnInit,OnDestroy{

  service = inject(UtilisateurService);
  private destroy$ = new Subject<void>();


  constructor(public dialogRef: MatDialogRef<AddUtilisateurComponent>, private notif: ToastrService) {
  }

  ngOnInit(): void {
    this.form;
  }


  form = new FormGroup({
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
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.service.add(this.form.value as Utilisateur).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.notif.success("Utilisateur ajouté", "SUCCESS");
          this.form.reset();
        },
        error: (err: any)=>this.notif.error(err.error.message,err.error.reason)

    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

}
