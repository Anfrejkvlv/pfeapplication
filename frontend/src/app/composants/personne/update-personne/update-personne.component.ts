import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { Personne } from '../../../interface/personne.interface';
import { PersonneService } from '../../../services/personne/personne.service';
import { AddPersonneComponent } from '../add-personne/add-personne.component';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-update-personne',
  standalone: true,
  providers:[provideNativeDateAdapter(),DatePipe],
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatSelectModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './update-personne.component.html',
  styleUrl: './update-personne.component.css'
})
export class UpdatePersonneComponent {
  private destroy$= new Subject<void>();
  constructor(private service: PersonneService,public dialogRef: MatDialogRef<AddPersonneComponent>,@Inject(MAT_DIALOG_DATA) public data: { currentCode: string }){
  }
    ngOnInit(): void {
        this.loadCurrentData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


  updateForm = new FormGroup({
    cin: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z0-9]{8}$/)
    ]),
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    dateNaissance: new FormControl<Date | null>(null, Validators.required),
    sexe: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required)
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
          sexe: resp.sexe
        });
      },
      error:(err)=>{
        console.error("Problème lors du chargement, ",err)
      }
      }

  );
    }


  onUpdateSubmit(): void {
  if (this.updateForm.valid) {
    const formData = this.service.createNewPerson(this.data.currentCode, this.updateForm.value as Personne);

    this.service.update(this.data.currentCode, formData).pipe(
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
