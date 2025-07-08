import {Component, inject, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AddResponsabilityComponent} from "../add-responsability/add-responsability.component";
import {UpdateResponsabilityComponent} from "../update-responsability/update-responsability.component";
import * as XLSX from 'xlsx';
import { Responsability } from '../../../interface/responsability.interface';
import { ResponsabilityService } from '../../../services/responsability/responsability.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';


@Component({
  selector: 'app-liste-responsability',
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
  templateUrl: './liste-responsability.component.html',
  styleUrl: './liste-responsability.component.css'
})
export class ListeResponsabilityComponent {
    readonly dialog = inject(MatDialog);

      displayedColumns: string[] = ['code', 'titre', 'action'];
      dataSource: MatTableDataSource<Responsability> = new MatTableDataSource<Responsability>([]);

      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;
      private destroy$= new Subject<void>();

      constructor(private service: ResponsabilityService,private notif: ToastrService, public shared: SharedService) {
          this.dataSource = new MatTableDataSource<Responsability>([]);

      }

      ngOnInit(): void {
        this.getAllResp();
      }

      ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
      }

    getAllResp(): void {
      this.service.getAll()
      .subscribe({
        next: (response: any) => {
          //console.log("Réponse complète:", response);

          if (response && response.data && response.data.responsabilites) {
            this.dataSource.data = response.data.responsabilites;
            this.notif.success(`${this.dataSource.data.length} Responsabilités recupérées`)
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
        const dialogRef = this.dialog.open(AddResponsabilityComponent,{
          width:'500px',
          maxWidth:'520px'
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
          if(result) this.getAllResp();
        });
      }

      openDialogUptade(code: string) {
      if(this.shared.isJury){
        this.shared.sendWarning();
      }else{
        //console.log('Opening update dialog with code: ', code);
        const dialogRef = this.dialog.open(UpdateResponsabilityComponent,{
          width:'499px',
          height:'370px',
          data: {currentCode: code}
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result) this.getAllResp();
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
          next: () => this.getAllResp(),
          error: (err) => console.error(err)
        });
      }
    }
  }
      printReport(): void {
      const data = this.dataSource.data.map(d => ({
        Code: d.code,
        Titre: d.titre,
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = { Sheets: { 'Responsabilités': worksheet }, SheetNames: ['Responsabilités'] };
      XLSX.writeFile(workbook, 'Liste-Responsabilités.xlsx');
    }
}
