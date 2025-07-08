import { CustomHttpResponse } from './../../../interface/custom-http-response';
import { CommonModule } from '@angular/common';
import {AfterViewInit, Component, inject, NgModule, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatFabButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTableDataSource,
  MatTableModule,
} from "@angular/material/table";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {AddPersonneComponent} from "../add-personne/add-personne.component";
import {UpdatePersonneComponent} from "../update-personne/update-personne.component";
import * as XLSX from 'xlsx';
import { Personne } from '../../../interface/personne.interface';
import { PersonneService } from '../../../services/personne/personne.service';
import { catchError, map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { AppState } from '../../../interface/appstate.interface';
import { DataState } from '../../../enumeration/datastate.enum';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../../../services/shared.service';


@Component({
  selector: 'app-liste-personne',
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
    MatHeaderCellDef,CommonModule,FormsModule,ReactiveFormsModule,MatProgressSpinner,MatError
  ],
  templateUrl: './liste-personne.component.html',
  styleUrl: './liste-personne.component.css'
})
export class ListePersonneComponent implements AfterViewInit, OnInit,OnDestroy{
    readonly dialog = inject(MatDialog);
    showLoading:boolean=false;

      displayedColumns: string[] = ['cin', 'nom', 'prenom','email','dateNaissance','sexe','telephone','action'];
      dataSource: MatTableDataSource<Personne> = new MatTableDataSource<Personne>([]);

      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;
      private destroy$= new Subject<void>();
      appState$?:Observable<AppState<CustomHttpResponse>>;
      readonly DataState = DataState;
      admin:boolean=false;


      constructor(private service: PersonneService, private notif: ToastrService, public shared: SharedService) {
          this.dataSource = new MatTableDataSource<Personne>([]);

      }

      ngOnInit(): void {
        this.admin=this.shared.isAdmin;
        this.showLoading=true;
         this.appState$=this.service.getP()
         .pipe(
          map(response=>{
          if (response) {
            console.log("Réponse complète:", response);
            this.dataSource.data = response.data.personnes;
            this.notif.success(response.message);
            console.log("État actuel:", DataState.LOADED);
            this.showLoading=false;
          } else {
            console.error("Structure de réponse inattendue:", response);
          }
          return {dataState: DataState.LOADED,data:response}
          }),
          startWith({dataState: DataState.LOADING}),
          catchError((error:string)=>{
            return of({dataState: DataState.ERROR, error:error})
          })
         );
      }

      ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
      }

    getAllPerson(): void {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          console.log("Réponse complète:", response);

          if (response) {
            //this.dataSource.data = response;
            console.log("Données assignées:", this.dataSource.data);
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
        const dialogRef = this.dialog.open(AddPersonneComponent,{
          width:'550px',
          maxWidth:'570px'
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
          if(result) this.getAllPerson();
        });
      }

      openDialogUptade(cin: string) {
      if(!this.shared.isAdmin && !this.shared.isAdminAndEmp){
          this.shared.sendWarning();
      }else{
        console.log('Opening update dialog with code:', cin);
        const dialogRef = this.dialog.open(UpdatePersonneComponent,{
          width:'570px',
          height:'auto',
          data: {currentCode: cin}
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result) this.getAllPerson();
        });
      }
      }


    onDeleteDept(cin: string) {
      if(!this.shared.isAdmin){
          this.shared.sendWarning();
      }else{

      if(confirm('Confirmer la suppression')) {
        this.service.delete(cin).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (response: CustomHttpResponse|HttpErrorResponse) => {
            this.notif.success(response.message);
            this.getAllPerson()},
          error: (err:HttpErrorResponse) => {
            this.notif.error("Erreur:",err.message);
            console.error(err.message)}
        });
      }}
    }

      printReport(): void {
      const data = this.dataSource.data.map(d => ({
        CIN: d.cin,
        Nom: d.nom,
        Prénom: d.prenom,
        Email: d.email,
        DateNaissance: d.dateNaissance,
        Sexe: d.sexe,
        Téléphone: d.telephone
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = { Sheets: { 'Personnes': worksheet }, SheetNames: ['Personnes'] };
      XLSX.writeFile(workbook, 'Liste-Persones.xlsx');
    }
}

