import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatInput} from "@angular/material/input";
import {MatDialog} from "@angular/material/dialog";
import {AddProfesseurComponent} from "../add-professeur/add-professeur.component";
import {UpdateProfesseurComponent} from "../update-professeur/update-professeur.component";
import * as XLSX from 'xlsx';
import { Professeur } from '../../../interface/professeur.interface';
import { ProfesseurService } from '../../../services/professeur/professeur.service';
import { Subject, takeUntil } from 'rxjs';
import { Departement } from '../../../interface/departement.interface';
import { DepartementService } from '../../../services/departement/departement.service';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-details-professeur',
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
    MatHeaderCellDef,MatTooltip
  ],
  templateUrl: './details-professeur.component.html',
  styleUrl: './details-professeur.component.css'
})
export class DetailsProfesseurComponent implements OnInit, OnDestroy,AfterViewInit {

    readonly dialog = inject(MatDialog);

      displayedColumns: string[] = ['code', 'nom', 'prenom','email',"Département",'action'];
      dataSource: MatTableDataSource<Professeur> = new MatTableDataSource<Professeur>([]);

      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;
      private destroy$= new Subject<void>();
      public departements: Departement[]=[];
      public codeDepartement!: string;

      constructor(private service: ProfesseurService, private deptServ: DepartementService, private router:Router,private notif: ToastrService, public shared: SharedService) {
          this.dataSource = new MatTableDataSource<Professeur>([]);
      }

      ngOnInit(): void {
        this.listeDept();
        this.getAllProf();
        //this.onInfo(this.codeDepartement);
      }

    onInfo(code: string):void {
      this.router.navigate(['details-professeur',code]);
      //throw new Error("Erreur lors de la redirection");
  }

      listeDept():void{
        this.deptServ.getAll().subscribe({
          next:(response)=>{
            this.departements=response;
          },
          error:(err:HttpErrorResponse)=>{
            this.notif.error("Erreur lors de la recuperation des departements, ",err.error.reason)
             // console.log("Erreur lors de la recuperation des departements, ",err);
          }
        })
      }

  checkId(id: number): string {
          for (const departement of this.departements) {
            if (departement.id === id) {
              return departement.nom;
            }
          }
          return 'null';
  }

      ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
      }

    getAllProf(): void {
      this.service.getAll()
      .subscribe({
        next: (response) => {
          //console.log("Réponse complète:", response);

          if (response) {
            this.notif.success(`${response.length} Professeurs recupérés`,"SUCCESS");
            this.dataSource.data = response;
            //console.log("Données assignées:", this.dataSource);
          } else {
            console.error("Structure de réponse inattendue:", response);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur lors du chargement:', err);
          this.notif.error("Erreur lors de la recuperation des données"+err.message,"WARNING");
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
        const dialogRef = this.dialog.open(AddProfesseurComponent,{
          width:'550px',
          maxWidth:'570px'
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
          if(result) this.getAllProf();
        });
      }

      openDialogUptade(code: string) {
      if(this.shared.isJury){
          this.shared.sendWarning();
      }else{
        //console.log('Opening update dialog with code:', code);
        const dialogRef = this.dialog.open(UpdateProfesseurComponent,{
          width:'570px',
          height:'auto',
          data: {currentCode: code}
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result) this.getAllProf();
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
          next: () => {
            this.getAllProf()
          },
          error: (err) => console.error(err)
        });
      }
    }
  }

      printReport(): void {
      const data = this.dataSource.data.map(d => ({
        CODE: d.code,
        Nom: d.nom,
        Prénom: d.prenom,
        Email: d.email,
        Département: this.checkId(d.idDepartement),
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = { Sheets: { 'Professeurs': worksheet }, SheetNames: ['Professeurs'] };
      XLSX.writeFile(workbook, 'Liste-Professeurs.xlsx');
    }
}
