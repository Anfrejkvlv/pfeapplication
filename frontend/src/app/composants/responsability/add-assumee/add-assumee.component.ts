import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AddProfesseurComponent } from '../../professeur/add-professeur/add-professeur.component';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AssumeeService } from '../../../services/asssumee/assumee.service';
import { RespAssumeDTO } from '../../../interface/respAssumee.interface';
import { GradeObtenuDTO } from '../../../interface/gradeObtenu.interface';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ObtenuService } from '../../../services/obtenu/obtenu.service';
import { ResponsabilityService } from '../../../services/responsability/responsability.service';
import { Responsability } from '../../../interface/responsability.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-assumee',
  standalone: true,
  imports: [        FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatSelectModule],
  templateUrl: './add-assumee.component.html',
  styleUrl: './add-assumee.component.css'
})
export class AddAssumeeComponent implements OnInit,OnDestroy{
  private destroy$= new Subject<void>();
  public resposabilities: Responsability[]=[];
  public grades:GradeObtenuDTO[]=[];
  public code?:string;


  constructor(public dialogRef: MatDialogRef<AddProfesseurComponent>, private assumeS: AssumeeService,private gService: ObtenuService,private rService: ResponsabilityService, @Inject(MAT_DIALOG_DATA) public data: { currentCode: string },private datePipe:DatePipe,private notif:ToastrService){
     this.code=data.currentCode;
  }
  ngOnInit(): void {
    this.form;
    this.listeResp();
    this.listeG(this.code!);
  }

  listeG(code:string):void{
      this.gService.getAll(code).subscribe({
      next:(response)=>{
        this.grades=response;
        console.log("GRADES",this.grades)
      },
      error:err=>{
        console.log("Erreur lors du chargement des responsabilités",err);
      }
    });
  }

  listeResp():void{
      this.rService.getAll1().subscribe({
      next:(response)=>{
        this.resposabilities=response;
        console.log("RESP",this.resposabilities)
      },
      error:err=>{
        console.log("Erreur lors du chargement des responsabilités");
      }
    });
  }


  form = new FormGroup({
    dateDebut: new FormControl<any | null>(null, Validators.required),
    dateFin: new FormControl<any | null>(null),
    idResponsabilite: new FormControl<number>(0 ,Validators.required),
    idGradeObtenu: new FormControl<number>(0 ,Validators.required)
  });

  onSubmit(): void {
    if(this.form.invalid) return;
      const dateD:Date|null=this.form.value.dateDebut;
      const dateF:Date|null=this.form.value.dateFin;

      this.form.value.dateDebut=this.datePipe.transform(dateD,"yyyy-MM-dd");
      this.form.value.dateFin=dateF? this.datePipe.transform(dateF,"yyyy-MM-dd"):null;
      this.assumeS.add(this.data.currentCode,this.form.value as RespAssumeDTO).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.notif.success("Attrubuée avec succès".toUpperCase(),"succès".toUpperCase())
          this.form.reset();
        },
        error: (err:HttpErrorResponse) => this.notif.error(err.error.message,err.error.reson)
      });

  }

  ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
  }
}
