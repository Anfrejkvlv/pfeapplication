import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GradeService } from '../../../services/grade/grade.service';
import { Subject, takeUntil } from 'rxjs';
import { Grade } from '../../../interface/grade.interface';
import { GradeObtenuDTO } from '../../../interface/gradeObtenu.interface';
import { ObtenuService } from '../../../services/obtenu/obtenu.service';
import { RespAssumeDTO } from '../../../interface/respAssumee.interface';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-obtenu',
  standalone: true,
  imports: [
FormsModule,
        MatButton,
        MatDialogClose,
        ReactiveFormsModule,MatFormFieldModule,
        CommonModule,MatInputModule,MatDialogModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatSelectModule
        ],
  templateUrl: './add-obtenu.component.html',
  styleUrl: './add-obtenu.component.css'
})
export class AddObtenuComponent {
  private destroy$= new Subject<void>();
  public grades:Grade[]=[];
  public code?:string;


  constructor(public dialogRef: MatDialogRef<AddObtenuComponent>,private gService: ObtenuService,private service: GradeService, @Inject(MAT_DIALOG_DATA) public data: { currentCode: string },private datePipe:DatePipe, private notif:ToastrService){
     this.code=data.currentCode;
  }
  ngOnInit(): void {
    this.form;
    this.listeG();
  }

  listeG():void{
      this.service.getAll().subscribe({
      next:(response)=>{
        this.grades=response;
        console.log("GRADES",this.grades)
      },
      error:err=>{
        console.log("Erreur lors du chargement des grades",err);
      }
    });
  }

  form = new FormGroup({
    dataObtention: new FormControl<any | null>(null, Validators.required),
    idGrade: new FormControl<number>(0 ,Validators.required)
  });

  onSubmit(): void {
    if(this.form.invalid) return;
      const dateO:Date|null=this.form.value.dataObtention;
      this.form.value.dataObtention=this.datePipe.transform(dateO,"yyyy-MM-dd");
      this.gService.add(this.data.currentCode,this.form.value as GradeObtenuDTO).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
          this.notif.success("NOUVEL GRADE ATTRIBUE","SUCCESS")
          this.form.reset();
        },
        error: (err:HttpErrorResponse) =>{
          this.notif.warning(err.error.message,"WARNING");
          console.error(err)}
      });

  }

  ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
  }
}
