import {Component, inject, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef, MatTable,
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AddUtilisateurComponent} from "../add-utilisateur/add-utilisateur.component";
import {UpdateUtilisateurComponent} from "../update-utilisateur/update-utilisateur.component";
import { MatTooltip } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { Utilisateur } from '../../../interface/utilisateur.interface';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SharedService } from '../../../services/shared.service';
import { HttpBackend, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-liste-utilisateur',
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
    MatHeaderCellDef, MatTooltip,CommonModule
],
  templateUrl: './liste-utilisateur.component.html',
  styleUrl: './liste-utilisateur.component.css'
})
export class ListeUtilisateurComponent {
readonly dialog = inject(MatDialog);


        displayedColumns: string[] = ['userId', 'nom', 'prenom','username','role','statut','action'];
        dataSource: MatTableDataSource<Utilisateur> = new MatTableDataSource<Utilisateur>([]);

        @ViewChild(MatPaginator) paginator!: MatPaginator;
        @ViewChild(MatSort) sort!: MatSort;
        private destroy$= new Subject<void>();
        public showLoadin!:boolean;

        users: Utilisateur[]=[];
        constructor(private service: UtilisateurService, private router:Router, private notif: ToastrService, public shared: SharedService) {
            this.dataSource = new MatTableDataSource<Utilisateur>([]);
        }

      ngOnInit(): void {
          this.getAllUsers();
          //this.onInfo(this.codeDepartement);
        }

      onInfo(code: string):void {
        this.router.navigate(['details-professeur',code]);
        //throw new Error("Erreur lors de la redirection");
    }

      ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        }

      getAllUsers(): void {

        this.service.getAll()
        .subscribe({
          next: (response: Utilisateur[]) => {
            //console.log("Réponse complète:", response);
            this.showLoadin=true;
            if (response ) {
              this.service.addUsersToLocalCache(response);
              this.users=response;
              this.notif.success(`${this.users.length} Utilisateurs recupérés`,'SUCCESS');
              this.dataSource.data = response;
              this.showLoadin=false;
              //console.log("Données assignées:", this.dataSource);
            } else {
              console.error("Structure de réponse inattendue:", response);
              this.showLoadin=false;
            }
          },
          error: (err:HttpErrorResponse) => {
            console.error(err.error.message,'Erreur lors du chargement:'+err.error.reason );
            this.notif.error()
            this.showLoadin=false;
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
          const dialogRef = this.dialog.open(AddUtilisateurComponent,{
        panelClass: 'custom-dialog'
    });
          dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
            if(result) this.getAllUsers();
          });
        }

      openDialogUptade(username: string) {
      if(this.shared.isJury){
          this.shared.sendWarning();
      }else{
          console.log('Opening update dialog with code:', username);
          const dialogRef = this.dialog.open(UpdateUtilisateurComponent,{
            panelClass:'custom-dialog',
            data: {currentCode: username}
          });

          dialogRef.afterClosed().subscribe(result => {
            if(result) this.getAllUsers();
          });
        }
      }

      onDeleteDept(code: string) {
      if(!this.shared.isAdmin){
          this.shared.sendWarning();
      }else{
        if(confirm('Confirmer la suppression')) {
          this.service.locked(code).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            next: () => this.getAllUsers(),
            error: (err) => console.error(err)
          });
        }
      }
    }

      printReport(): void {
        const data = this.dataSource.data.map(d => ({
          username: d.email,
          Nom: d.nom,
          Prénom: d.prenom,
          Role: d.role,
        }));

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = { Sheets: { 'Utilisateur': worksheet }, SheetNames: ['Utilisateurs'] };
        XLSX.writeFile(workbook, 'Liste-Utilisateurs.xlsx');
      }
}
