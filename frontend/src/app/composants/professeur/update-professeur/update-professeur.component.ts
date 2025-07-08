import { Component, Inject } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { ProfesseurService } from '../../../services/professeur/professeur.service';
import { Professeur } from '../../../interface/professeur.interface';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepartementService } from '../../../services/departement/departement.service';
import { Departement } from '../../../interface/departement.interface';

@Component({
  selector: 'app-update-professeur',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatSelectModule
    ],
  templateUrl: './update-professeur.component.html',
  styleUrl: './update-professeur.component.css'
})
export class UpdateProfesseurComponent {
  private destroy$= new Subject<void>();
  public departements: Departement[]=[];
  private isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoading.asObservable();

  constructor(private service: ProfesseurService,public dialogRef: MatDialogRef<UpdateProfesseurComponent>,@Inject(MAT_DIALOG_DATA) public data: { currentCode: string },private deptS: DepartementService){
  }
    ngOnInit(): void {
        this.loadCurrentData();
    this.updateForm;

    this.deptS.getAll().subscribe({
      next:(response)=>{
        this.departements=response;
      },
      error:err=>{
        console.log("Erreur lors du chargement des departements");
      }
    });

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

      checkId(id: number): string {
          for (const departement of this.departements) {
            if (departement.id === id) {
              return departement.nom; // ID trouvé
            }
          }
          return 'null'; // ID non trouvé
  }

  updateForm = new FormGroup({
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
    dateNaissance: new FormControl<string | ''>('', Validators.required),
    sexe: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required),
    idDepartement: new FormControl<number>(0, Validators.required)
  });

private loadCurrentData(): void {
      this.service.getOne(this.data.currentCode).subscribe({
        next:(resp) => {
        this.updateForm.patchValue({
          code: resp.code,
          cin: resp.cin,
          nom: resp.nom,
          prenom: resp.prenom,
          email: resp.email,
          dateNaissance: resp.dateNaissance,
          telephone: resp.telephone,
          sexe: resp.sexe,
          idDepartement:resp.idDepartement
        });
      },
      error:(err)=>{
        console.error("Problème lors du chargement, ",err)
      }
      }

  );
    }


  onUpdateSubmit(): void {
  if (this.updateForm.invalid) return;
    this.isLoading.next(true);
    this.service.update(this.data.currentCode, this.updateForm.value as Professeur).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.updateForm.reset();
        this.isLoading.next(false);

      },
      error: (err) => {
        console.error(err)
        this.isLoading.next(true);
      }
    });
  }
}

