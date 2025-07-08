import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { Subject, takeUntil } from 'rxjs';
import { GradeService } from '../../../services/grade/grade.service';
import { Grade } from '../../../interface/grade.interface';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-grade',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,
    ],
  templateUrl: './add-grade.component.html',
  styleUrl: './add-grade.component.css'
})
export class AddGradeComponent {

  service=inject(GradeService);
  private destroy$= new Subject<void>();


  constructor(public dialogRef: MatDialogRef<AddGradeComponent>){}
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

  form = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z]{2,5}$/)
    ]),
    grade: new FormControl('', Validators.required)
  });


  onSubmit(): void {
    if(this.form.valid) {
      const formData = this.service.createNewGrade(null!, this.form.value as Grade);
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
