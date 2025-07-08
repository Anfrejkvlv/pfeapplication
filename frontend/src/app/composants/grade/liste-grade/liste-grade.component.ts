import {Component, inject, ViewChild} from '@angular/core';
import {MatButton, MatFabButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {UpdateGradeComponent} from "../update-grade/update-grade.component";
import {AddGradeComponent} from "../add-grade/add-grade.component";
import { Grade } from '../../../interface/grade.interface';
import { GradeService } from '../../../services/grade/grade.service';
import { Subject, takeUntil } from 'rxjs';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-liste-grade',
  standalone: true,
  imports: [
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFabButton,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatInput,
    MatLabel,
    MatPaginatorModule,
    MatRow,
    MatRowDef,
    MatSortModule,
    MatTableModule,
    MatNoDataRow,
    MatHeaderCellDef
  ],
  templateUrl: './liste-grade.component.html',
  styleUrl: './liste-grade.component.css'
})
export class ListeGradeComponent {
  readonly dialog = inject(MatDialog);

    displayedColumns: string[] = ['code', 'grade', 'action'];
    dataSource: MatTableDataSource<Grade> = new MatTableDataSource<Grade>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    private destroy$= new Subject<void>();
    grades:Grade[]=[];

    constructor(private service: GradeService,private notif: ToastrService, public shared: SharedService) {
        this.dataSource = new MatTableDataSource<Grade>([]);

    }

    ngOnInit(): void {
      this.getAllGrade();
    }

    ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    }

  getAllGrade(): void {
    this.service.getAll()
    .subscribe({
      next: (response: any) => {
        //console.log("Réponse complète:", response);

        if (response) {
          this.dataSource.data = response;
          this.grades=this.dataSource.data;
          this.notif.success(`${this.dataSource.data.length} Grades recupérés`);
          //console.log("Données assignées:", this.dataSource.data);
        } else {
          console.error("Structure de réponse inattendue:", response);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
      }
    });
  }


    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {    const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage()
          }
    }


    openDialog() {
      const dialogRef = this.dialog.open(AddGradeComponent,{
        width:'500px',
        maxWidth:'520px'
      });
      dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
        if(result) this.getAllGrade();
      });
    }

    openDialogUptade(code: string) {
    if(this.shared.isJury){
      this.shared.sendWarning();
    }else{
      console.log('Opening update dialog with code:', code);
      const dialogRef = this.dialog.open(UpdateGradeComponent,{
        width:'499px',
        height:'370px',
        data: {currentCode: code}

      });

      dialogRef.afterClosed().subscribe(result => {
        if(result) this.getAllGrade();
      });
    }
  }

  onDeleteDept(code: string) {
    if(!this.shared.isAdmin){
   this.shared.sendWarning();
 }else{
    if(confirm('Confirmer la suppression')) {
      this.service.delete(code).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => this.getAllGrade(),
        error: (err) => console.error(err)
      });
    }
  }
}

    printReport(): void {
    const data = this.dataSource.data.map(d => ({
      Code: d.code,
      Grade: d.grade,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Grades': worksheet }, SheetNames: ['Grades'] };
    XLSX.writeFile(workbook, 'Liste-Grades.xlsx');
  }
}

