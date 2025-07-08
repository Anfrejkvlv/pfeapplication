//import { XLSX } from './../../../../../node_modules/xlsx/types/index.d';
import { Departement } from './../../../interface/departement.interface';
import { AfterViewInit, Component, inject, OnInit, ViewChild, signal, OnDestroy } from '@angular/core';
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
import {AddDepartementComponent} from "../add-departement/add-departement.component";
import {UpdateDepartementComponent} from "../update-departement/update-departement.component";
import { DepartementService } from '../../../services/departement/departement.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-liste-departement',
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
  templateUrl: './liste-departement.component.html',
  styleUrl: './liste-departement.component.css'
})
export class ListeDepartementComponent implements AfterViewInit, OnInit,OnDestroy {

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['code', 'nom', 'action'];
  dataSource: MatTableDataSource<Departement> = new MatTableDataSource<Departement>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private destroy$= new Subject<void>();
  public depts:Departement []=[];

  //public refreshing:boolean=false;
  constructor(private service: DepartementService,private notif: ToastrService, public shared: SharedService) {
      this.dataSource = new MatTableDataSource<Departement>([]);

  }

  ngOnInit(): void {
    this.getAllDept();
  }

  ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
  }

getAllDept(): void {
  this.service.getAll()
  .subscribe({
    next: (response) => {
      //console.log("Réponse complète:", response);

      // Vérification de la structure exacte de la réponse
      if (response ) {
        this.dataSource.data = response;
        this.depts=this.dataSource.data;
        this.notif.success(`${this.dataSource.data.length} Départements recupérés`);
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
    const dialogRef = this.dialog.open(AddDepartementComponent,{
      width:'500px',
      maxWidth:'520px'
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
      if(result) this.getAllDept();
    });
  }

  openDialogUptade(code: string) {
if(this.shared.isJury){
   this.shared.sendWarning();
 }else{
    console.log('Opening update dialog with code:', code);
    const dialogRef = this.dialog.open(UpdateDepartementComponent,{
      width:'500px',
      height:'370px',
      data: {currentCode: code}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.getAllDept();
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
      next: () => this.getAllDept(),
      error: (err) => console.error(err)
    });
  }
}
}

  printReport(): void {
  const data = this.dataSource.data.map(d => ({
    Code: d.code,
    Nom: d.nom,
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = { Sheets: { 'Départements': worksheet }, SheetNames: ['Départements'] };
  XLSX.writeFile(workbook, 'Liste-Départements.xlsx');
}
}


