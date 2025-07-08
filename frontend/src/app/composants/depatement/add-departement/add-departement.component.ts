import { Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { DepartementService } from '../../../services/departement/departement.service';
import { Departement } from '../../../interface/departement.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-departement',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,
    ],
  templateUrl: './add-departement.component.html',
  styleUrl: './add-departement.component.css'
})
export class AddDepartementComponent implements OnDestroy {
service=inject(DepartementService);
private destroy$= new Subject<void>();

constructor(public dialogRef: MatDialogRef<AddDepartementComponent>){}
  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

form = new FormGroup({
  code: new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Z]{2,5}$/)
  ]),
  nom: new FormControl('', Validators.required)
});


onSubmit(): void {
  if(this.form.valid) {
    const formData = this.service.createNewDept(null!, this.form.value as Departement);
    this.service.add(formData).pipe(
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
private clickButton(buttonId: string): void {
  const element = document.getElementById(buttonId);
  if (element && element instanceof HTMLElement) {
    element.click();
  }
}

}
