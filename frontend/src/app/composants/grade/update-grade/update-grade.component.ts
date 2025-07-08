import { Grade } from './../../../interface/grade.interface';
import { Component, Inject } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { AddGradeComponent } from '../add-grade/add-grade.component';
import { GradeService } from '../../../services/grade/grade.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-update-grade',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,
    ],
  templateUrl: './update-grade.component.html',
  styleUrl: './update-grade.component.css'
})
export class UpdateGradeComponent {
private destroy$= new Subject<void>();
constructor(private service: GradeService,public dialogRef: MatDialogRef<AddGradeComponent>,@Inject(MAT_DIALOG_DATA) public data: { currentCode: string }){
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
  grade: new FormControl('', Validators.required)
});

  private loadCurrentData(): void {
    this.service.getOne(this.data.currentCode).subscribe({
      next:(grade) => {
      console.log("LE GRADE, ", this.data.currentCode)
      this.updateForm.patchValue({
        code: grade.code,
        grade: grade.grade

      });
    },
    error:(err)=>{
      console.error("Problème lors du chargement, ",err)
    }
    }

);
  }

onUpdateSubmit(): void {
  if(this.updateForm.valid) {
    const formData = this.service.createNewGrade(this.data.currentCode, this.updateForm.value as Grade);
    this.service.update(this.data.currentCode,formData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        console.log("LE GRADE, ", this.data.currentCode)
        this.dialogRef.close(true);
        this.updateForm.reset();
      },
      error: (err) => console.error(err)
    });
  }
}
}
