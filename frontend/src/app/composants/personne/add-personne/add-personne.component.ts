import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { Personne } from '../../../interface/personne.interface';
import { PersonneService } from '../../../services/personne/personne.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import {  provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-personne',
  standalone: true,
    providers:[provideNativeDateAdapter(), DatePipe],
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatSelectModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-personne.component.html',
  styleUrl: './add-personne.component.css'
})
export class AddPersonneComponent implements OnInit,OnDestroy{

  service=inject(PersonneService);
  private destroy$= new Subject<void>();


  constructor(public dialogRef: MatDialogRef<AddPersonneComponent>){}
  ngOnInit(): void {
    this.form;
  }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

  form = new FormGroup({
    cin: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z0-9]{5,8}$/)
    ]),
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    dateNaissance: new FormControl<Date | null>(null, Validators.required),
    sexe: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required)
  });
    onSubmit(): void {
    if(this.form.valid) {
      const formData = this.service.createNewPerson(null!, this.form.value as Personne);
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
}
