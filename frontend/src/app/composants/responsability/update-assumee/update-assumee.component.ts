import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Responsability } from '../../../interface/responsability.interface';
import { GradeObtenuDTO } from '../../../interface/gradeObtenu.interface';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ResponsabilityService } from '../../../services/responsability/responsability.service';
import { AssumeeService } from '../../../services/asssumee/assumee.service';
import { RespAssumeDTO } from '../../../interface/respAssumee.interface';
import { ObtenuService } from '../../../services/obtenu/obtenu.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-assumee',
  standalone: true,
  imports: [
            FormsModule,
            MatButton,
            MatDialogClose,
            ReactiveFormsModule,MatFormFieldModule,
            CommonModule,MatInputModule,MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatSelectModule
  ],
  templateUrl: './update-assumee.component.html',
  styleUrl: './update-assumee.component.css'
})
export class UpdateAssumeeComponent {
    private destroy$= new Subject<void>();
    public resposabilities: Responsability[]=[];
    public grades:GradeObtenuDTO[]=[];
    private isLoading = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoading.asObservable();


    constructor(public dialogRef: MatDialogRef<UpdateAssumeeComponent>,@Inject(MAT_DIALOG_DATA) public data: { currentCode: string, currentIdResp:number, currentId:number },private assumeS: AssumeeService,private gService:ObtenuService,private respS:ResponsabilityService, private datePipe:DatePipe,private notif:ToastrService){
    }
      ngOnInit(): void {
          this.loadCurrentData();
      this.updateForm;
        this.listeG(this.data.currentCode);
        this.listeResp();

      }

  listeG(code:string):void{
      this.gService.getAll(code).subscribe({
      next:(response)=>{
        this.grades=response;
        //console.log("GRADES",this.grades)
      },
      error:err=>{
        console.log("Erreur lors du chargement des responsabilités",err);
      }
    });
  }

  listeResp():void{
      this.respS.getAll1().subscribe({
      next:(response)=>{
        this.resposabilities=response;
        //console.log("RESP",this.resposabilities)
      },
      error:err=>{
        console.log("Erreur lors du chargement des responsabilités");
      }
    });
  }

  ngOnDestroy(): void {
          this.destroy$.next();
          this.destroy$.complete();

}

    updateForm = new FormGroup({
    dateDebut: new FormControl<any | null>(null, Validators.required),
    dateFin: new FormControl<any | null>(null),
    idResponsabilite: new FormControl<number>(0 ,Validators.required),
    idGradeObtenu: new FormControl<number>(0 ,Validators.required)
    });


  private loadCurrentData(): void {
        this.assumeS.getOne(this.data.currentCode, this.data.currentId).subscribe({
          next:(respA) => {
            //console.log("RECUPERER:",respA.titre);
          this.updateForm.patchValue({
            idGradeObtenu:respA.idGradeObtenu,
            dateDebut:respA.dateDebut,
            dateFin:respA.dateFin,
            idResponsabilite:respA.idResponsabilite
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
      const transform=this.updateForm.value;


      const dateD:Date|null=this.updateForm.value.dateDebut;
      const dateF:Date|null=this.updateForm.value.dateFin;

      this.updateForm.value.dateDebut=this.datePipe.transform(dateD,"yyyy-MM-dd");
      this.updateForm.value.dateFin=dateF? this.datePipe.transform(dateF,"yyyy-MM-dd"):null;

      this.assumeS.update(this.data.currentCode, this.data.currentId,this.updateForm.value as RespAssumeDTO).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.notif.success("Mise à jour éffectuée".toUpperCase(),"succès".toUpperCase());
          this.updateForm.reset();
          this.isLoading.next(false);
        },
        error: (err) => {
          console.error(err)
          this.notif.error(err.error.message,err.error);
          this.isLoading.next(true);
        }
      });
    }
}
