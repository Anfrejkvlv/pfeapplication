import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { ResponsabilityService } from '../../../services/responsability/responsability.service';
import { Responsability } from '../../../interface/responsability.interface';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-responsability',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,
    ],
  templateUrl: './add-responsability.component.html',
  styleUrl: './add-responsability.component.css'
})
export class AddResponsabilityComponent {

  service=inject(ResponsabilityService);
  private destroy$= new Subject<void>();


  constructor(public dialogRef: MatDialogRef<AddResponsabilityComponent>){}
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

  form = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z]{2,5}$/)
    ]),
    titre: new FormControl('', Validators.required)
  });


  onSubmit(): void {
    if(this.form.valid) {
      const formData = this.service.createNewResp(null!, this.form.value as Responsability);
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
