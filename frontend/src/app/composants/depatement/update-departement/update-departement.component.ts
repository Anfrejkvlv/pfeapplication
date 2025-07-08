import { Departement } from './../../../interface/departement.interface';
import { Component, Inject, inject, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { Subject, takeUntil, Observable } from 'rxjs';
import { DepartementService } from '../../../services/departement/departement.service';
import { AddDepartementComponent } from '../add-departement/add-departement.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-departement',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,
    ],
  templateUrl: './update-departement.component.html',
  styleUrl: './update-departement.component.css'
})
export class UpdateDepartementComponent implements OnInit {
private destroy$= new Subject<void>();

constructor(private service: DepartementService,public dialogRef: MatDialogRef<AddDepartementComponent>,@Inject(MAT_DIALOG_DATA) public data: { currentCode: string }){
}
  ngOnInit(): void {
      this.loadCurrentData();
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }


updateForm = new FormGroup({
  code: new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Z]{2,5}$/)
  ]),
  nom: new FormControl('', Validators.required)
});

  private loadCurrentData(): void {
    this.service.getOne(this.data.currentCode).subscribe({
      next:(dept) => {
      this.updateForm.patchValue({
        code: dept.code,
        nom: dept.nom
      });
    },
    error:(err: HttpErrorResponse)=>{
      console.error("Problème lors du chargement, ",err,err.message)
    }
    }

);
  }

onUpdateSubmit(): void {
  if(this.updateForm.valid) {
    const formData = this.service.createNewDept(this.data.currentCode, this.updateForm.value as Departement);
    this.service.update(this.data.currentCode,formData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.updateForm.reset();
      },
      error: (err) => console.error(err)
    });
  }
}
}
