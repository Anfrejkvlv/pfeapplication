import { Component, Inject } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { AddResponsabilityComponent } from '../add-responsability/add-responsability.component';
import { ResponsabilityService } from '../../../services/responsability/responsability.service';
import { Responsability } from '../../../interface/responsability.interface';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-responsability',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,
    ],
  templateUrl: './update-responsability.component.html',
  styleUrl: './update-responsability.component.css'
})
export class UpdateResponsabilityComponent {
private destroy$= new Subject<void>();
constructor(private service: ResponsabilityService,public dialogRef: MatDialogRef<AddResponsabilityComponent>,@Inject(MAT_DIALOG_DATA) public data: { currentCode: string }, private notif:ToastrService){
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
  titre: new FormControl('', Validators.required)
});

  private loadCurrentData(): void {
    this.service.getOne(this.data.currentCode).subscribe({
      next:(resp) => {
              console.log("LE GRADE, ", this.data.currentCode);
      this.updateForm.patchValue({
        code: resp.code,
        titre: resp.titre
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
    const formData = this.service.createNewResp(this.data.currentCode, this.updateForm.value as Responsability);
    this.service.update(this.data.currentCode,formData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {

        this.dialogRef.close(true);
        this.notif.success("Mise à jour éffectuée".toUpperCase(),"succès".toUpperCase());
        this.updateForm.reset();
      },
      error: (err:HttpErrorResponse) => {
        this.notif.error(err.error.message,err.error.error+"".toUpperCase());
        console.error(err);}
    });
  }
}
}
