import { ResponsabilityService } from './../../../services/responsability/responsability.service';
import { Responsability } from './../../../interface/responsability.interface';
import { Professeur } from './../../../interface/professeur.interface';
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatButtonModule, MatFabButton} from "@angular/material/button";
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
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import * as XLSX from 'xlsx';
import { RespAssumeDTO } from '../../../interface/respAssumee.interface';
import { ProfesseurService } from '../../../services/professeur/professeur.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { AssumeeService } from '../../../services/asssumee/assumee.service';
import { AddAssumeeComponent } from '../add-assumee/add-assumee.component';
import { UpdateAssumeeComponent } from '../update-assumee/update-assumee.component';
import { DepartementService } from '../../../services/departement/departement.service';
import { Departement } from '../../../interface/departement.interface';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../../../services/grade/grade.service';
import { ObtenuService } from '../../../services/obtenu/obtenu.service';
import { GradeObtenuDTO } from '../../../interface/gradeObtenu.interface';
import { Grade } from '../../../interface/grade.interface';
import { MatTooltip } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { AddObtenuComponent } from '../../grade/add-obtenu/add-obtenu.component';
import { HttpErrorResponse } from '@angular/common/http';
//import * as pdfMake from 'pdfmake/build/pdfmake';
//import * as pdfFonts from 'pdfmake/build/vfs_fonts'
declare const pdfFonts: any;
declare const pdfMake: any;

export interface ProfDto{
  nom: string;
  prenom:string;
  deparement:string;
  email:string;
}

@Component({
  selector: 'app-liste-assumee',
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
    MatHeaderCellDef,MatTooltip,
     CommonModule, MatCardModule, MatButtonModule,MatDivider,MatListItem,MatList,DatePipe
   ],changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './liste-assumee.component.html',
  styleUrl: './liste-assumee.component.css'
})

export class ListeAssumeeComponent implements AfterViewInit, OnInit,OnDestroy{


      readonly dialog = inject(MatDialog);

        displayedColumns: string[] = ['code','nom', 'prenom','titre','grade','Département','dateDebut','dateFin','action'];
        dataSource: MatTableDataSource<RespAssumeDTO> = new MatTableDataSource<RespAssumeDTO>([]);
        public departements: Departement[]=[];

        public codeProf?:string;
        public gObtenus: GradeObtenuDTO[]=[];
        public rAssumee: RespAssumeDTO[]=[];
        public resps:Responsability[]=[];
        public grades:Grade[]=[];
        public profes?: Professeur;
        public deps: Departement[]=[];

        @ViewChild(MatPaginator) paginator!: MatPaginator;
        @ViewChild(MatSort) sort!: MatSort;
        private destroy$= new Subject<void>();


      constructor(private route:ActivatedRoute,private profService:ProfesseurService,private assService: AssumeeService, private deptServ: DepartementService ,private obtenuSer:ObtenuService,private respS: ResponsabilityService, private gService: GradeService,private cdr: ChangeDetectorRef,private notif: ToastrService, public shared: SharedService) {
          this.dataSource = new MatTableDataSource<RespAssumeDTO>([]);
        //(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

      }

      ngOnInit(): void {
        const code=this.route.snapshot.params['code'];
        this.codeProf=code;
        this.profService.getOne(code).subscribe({
          next:(reponse)=>{
              this.profes=reponse;
          },error:(err)=>{
            console.log("Erreur lors de la recuperationdes donnees du professeur",err);
          }
        });
        //this.checkDeptId();
        this.listeResp();
        this.listeGrades();
        this.recupererDonnees(code);
      }

recupererDonnees(code:string):void{
  this.profes=new Professeur();
  forkJoin({
    grades:this.obtenuSer.getAll(code),
    respons:this.assService.getAll(code),
    depss: this.deptServ.getAll()
  }).subscribe({
    next:({grades,respons,depss})=>{
      this.deps=depss;
      this.gObtenus=grades;
      this.dataSource.data=respons;
      this.notif.success(`${respons.length} Responsabilites assumées`)
      this.rAssumee=respons;
      this.cdr.detectChanges();

    },
    error:(err:HttpErrorResponse)=>{
      this.notif.error(err.error.message,err.error.reason)
      console.log("Erreur lors de la recuperationdes donnees du professeur",err);
    }
  });


}

//************************RESPONSABILITES******************************** */
listeResp():void{
  this.respS.getAll().subscribe({
    next:(reponse)=>{
        this.resps=reponse;
    },
    error:(err)=>{
      console.log("Erreur lor de la recuperation des responsabilites",err);
    }
  })
}

checkRespId(id:number):string|null{
    for(const respons of this.resps){
      if(respons.id==id){
        return respons.titre;
      }
    }
    return null;
}
///*************************DEPARTEMENTS*************************** */


checkDeptId(): string|null {
            for (const dep of this.deps) {
              if(dep.id==this.profes?.idDepartement){
              return dep.nom;
              }
            }
          return null;
  }

//*********************************GRADES************************************ */
listeGrades():void{
        this.gService.getAll().subscribe({
          next:(response)=>{
            this.grades=response;
          },
          error:err=>{
              console.log("Erreur lors de la recuperation des departements, ",err);
          }
        })
  }

checkIdGrade(id: number): string|null {
          for (const g of this.grades) {
            if (g.id==id) {
              return g.grade;
            }
          }
          return null;
  }
//*********************************GRADES OBTENUS************************************ */
listeGOB():void{
        this.gService.getAll().subscribe({
          next:(response)=>{
            this.grades=response;
          },
          error:err=>{
              console.log("Erreur lors de la recuperation des departements, ",err);
          }
        })
  }

checkIdGrades(id: number): string|null {
          for (const g of this.grades) {
            if (g.id==id) {
              return g.grade;
            }
          }
        return 'null';
  }
  checkLastGrades(): string {
    if(!this.gObtenus|| this.gObtenus.length==0){
      return "Aucun grade obtenu";
    }

    const t=this.gObtenus.slice().sort((a,b)=>
    b.dataObtention.localeCompare(a.dataObtention)
    );
      return `${t[0].grade}`;
  }

  checkLastRespAss(): string {
  let lastDate: RespAssumeDTO[]=[];
  let activeCount = 0;

    for (const ra of this.rAssumee) {
        if (ra.active) {
          activeCount++;
        }
    }

    if(activeCount==0){
      lastDate=this.rAssumee.slice().sort((a,b)=>
      b.dateFin.localeCompare(a.dateFin));
    }

    lastDate=this.rAssumee.slice().sort((a,b)=>
      b.dateDebut.localeCompare(a.dateDebut));

    console.log("RESP", lastDate)
    if(lastDate.length>0 ){
    const titre=lastDate[0]!.titre===undefined? "Aucune" : lastDate[0]!.titre;
    console.log("RESPONSABILITE:",lastDate[0].titre);
    return `${titre}`;
    }
      return "AUCUNE";
  }


//***************************************************************************************** */

      ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
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


      openDialog(code: string) {
        const dialogRef = this.dialog.open(AddAssumeeComponent,{
          width:'550px',
          maxWidth:'570px',
          data:{currentCode:code}
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
          if(result) {
            this.checkDeptId();
            this.recupererDonnees(this.codeProf!)
          };
        });
      }

      openNewGrade(code: string) {
        const dialogRef = this.dialog.open(AddObtenuComponent,{
          width:'550px',
          maxWidth:'570px',
          data:{currentCode:code}
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
          if(result) this.recupererDonnees(this.codeProf!);
        });
      }

      openDialogUptade(code: string, idResp:number, ID: number) {

        if(this.shared.isJury){
              this.shared.sendWarning();
        }else{
        console.log('Opening update dialog with code: ' +code+"RESP:"+idResp+"Assumee: ",ID);

        const dialogRef = this.dialog.open(UpdateAssumeeComponent,{
          width:'570px',
          height:'auto',
          data: {currentCode: code, currentIdResp: idResp, currentId:ID}
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result) this.recupererDonnees(this.codeProf!);
        });
      }
    }

    onDeleteDept(code: string, idResp:number) {
    if(!this.shared.isAdmin){
        this.shared.sendWarning();
    }else{
      if(confirm('Confirmer la suppression')) {
        this.assService.delete(code,idResp).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: () => {
            this.notif.success("Suppression éffecutuée".toUpperCase(),"SUCCès".toUpperCase())
            this.checkDeptId();
            this.recupererDonnees(this.codeProf!);
          },
          error: (err:HttpErrorResponse) =>  this.notif.error(err.error.message,err.error.reason)
        });
      }
    }
  }



      printReport(): void {
      const data = this.dataSource.data.map(d => ({
        Code:this.profes?.code,
        Nom: this.profes?.nom,
        Prénom: this.profes?.prenom,
        Titre_Responsabilité: d.titre,
        Grade: d.grade,
        Département: this.checkDeptId(),
        DateDébut:d.dateDebut,
        DateFin:d.dateFin,
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = { Sheets: { 'Responsabilités Assumées': worksheet }, SheetNames: ['Responsabilités Assumées'] };
      XLSX.writeFile(workbook, 'Liste-Responsabilités-Assumées.xlsx');
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////
async generatePdfRepport(): Promise<void>{
      const data = this.dataSource.data.map(d => ({
        Code:this.profes?.code,
        Nom: this.profes?.nom,
        Prénom: this.profes?.prenom,
        titre: d.titre,
        grade: d.grade,
        dept: this.checkDeptId(),
        dateD:d.dateDebut,
        dateF:d.dateFin,
      }));

      if(data.length<=0){
          this.notif.error("Il n'y a aucune donnée a exporter".toUpperCase(),"ERREUR");
      }else{
        const logoData = await this.loadImageAsBase64('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2y6D5xjXdnvNTODSl3G4YjRM3zvSnKdP42eaLaVbtMm46jsh_KBceMO2DoCpNfobEZQ&usqp=CAU');


  // Construction du document PDF
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      columns: [
        // Logo à gauche
        {
          image: logoData,
          width: 170,
          alignment: 'left',
          margin: [40, 20, 0, 0]
        },
        // Espace vide à droite
        { text: '', width: '*' }
      ],
      margin: [0, 10, 0, 20]
    },
    content: [
      // Informations générales
      {
        columns: [
          {

            width: '*',
            stack: [
                      // Titre au centre
        {
          text: 'Rapport sur les responsabilités assumées',
          style: 'header',
          margin: [60, 100, 0, 60]
        },
              { text: 'Informations personnelles',style:'header', margin: [0, 0, 0, 5] },
              { text: `Code: ${this.profes?.code || ''}`, margin: [0, 0, 0, 5] },
              { text: `Nom: ${this.profes?.nom || ''}`, margin: [0, 0, 0, 5] },
              { text: `Prénom: ${this.profes?.prenom || ''}`, margin: [0, 0, 0, 5] },
              { text: `Responsabilité actuelle: ${this.checkLastRespAss()===undefined?"Aucune":this.checkLastRespAss()}`, margin: [0, 0, 0, 5] },
              { text: `Département: ${this.checkDeptId()===undefined?"Aucune": this.checkDeptId()}`, margin: [0, 0, 0, 5] },
              { text: `Grade actuel: ${this.checkLastGrades()}`, margin: [0, 0, 0, 5] },
              { text: `Email: ${this.profes!.email}`, margin: [0, 0, 0, 25] },

              {
                width: 200,
                text: `Date du rapport: ${new Date().toLocaleDateString()}`,
                alignment: 'right',
                italics: true,
                margin: [0, 10, 40, 10]
              }
            ]
          }
        ]
      },

      // Tableau des données
      /*{
        text: 'Liste des responsabilités assumées',
        style: 'subheader',
        margin: [0, 0, 0, 10]
      },*/
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            // En-têtes
            [
        { text: 'Responsabilité', style: 'tableHeader' },
        { text: 'Grade', style: 'tableHeader' },
        { text: 'Département', style: 'tableHeader' },
        { text: 'Date Début', style: 'tableHeader' },
        { text: 'Date Fin', style: 'tableHeader' }
            ],
            // Données
            ...data.map(item => [
              item.titre || '',
              item.grade || '',
              item.dept || '',
              item.dateD || '',
              item.dateF || 'Encours'
            ])
          ]
        },
        layout: {
          hLineWidth: (i:any) => i === 0 ? 1 : 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#aaa',
          vLineColor: () => '#aaa',
          paddingLeft: () => 5,
          paddingRight: () => 5,
          paddingTop: () => 3,
          paddingBottom: () => 3
        }
      },
            // Pied de page
   /*   {
        text: 'Signature:',
        margin: [360, 160, 0, 0],
        italics: true
      },
      {
        canvas: [{ type: 'line', x1: 100, y1: 5, x2: 250, y2: 5, lineWidth: 1 }],
        margin: [270, 5, 0, 0]
      }*/
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: '#2c3e50'
      },
      subtitle: {
        fontSize: 14,
        color: '#7f8c8d'
      },
      subheader: {
        fontSize: 14,
        bold: true,
        decoration: 'underline',
        color: '#34495e'
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        fillColor: '#3498db',
        color: 'white'
      }
    }
  };

  // Génération du PDF
  pdfMake.createPdf(docDefinition).open();
}
}

private async loadImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

}
