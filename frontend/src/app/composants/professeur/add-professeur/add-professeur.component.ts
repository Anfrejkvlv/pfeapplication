import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { ProfesseurService } from '../../../services/professeur/professeur.service';
import { Professeur } from '../../../interface/professeur.interface';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { Departement } from '../../../interface/departement.interface';
import { DepartementService } from '../../../services/departement/departement.service';

@Component({
  selector: 'app-add-professeur',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatSelectModule
    ],
  templateUrl: './add-professeur.component.html',
  styleUrl: './add-professeur.component.css'
})
export class AddProfesseurComponent implements OnDestroy,OnInit {

  service=inject(ProfesseurService);
  private destroy$= new Subject<void>();
  public departements: Departement[]=[];


  constructor(public dialogRef: MatDialogRef<AddProfesseurComponent>, private deptS: DepartementService){}
  ngOnInit(): void {
    this.form;

    this.deptS.getAll().subscribe({
      next:(response)=>{
        this.departements=response;
      },
      error:err=>{
        console.log("Erreur lors du chargement des departements");
      }
    })
  }


  form = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z0-9]{5,8}$/)
    ]),
    cin: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z0-9]{5,8}$/)
    ]),
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    dateNaissance: new FormControl<string | null>(null, Validators.required),
    sexe: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required),
    idDepartement: new FormControl<number>(0 ,Validators.required)
  });

    onSubmit(): void {
    if(this.form.valid) {
      this.service.add(this.form.value as Professeur).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.form.reset();
        },
        error: (err) => console.error(err)
      });
    }
  }

      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
