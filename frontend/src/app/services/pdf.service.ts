import { Injectable } from '@angular/core';
//import * as pdfMake from 'pdfmake/build/pdfmake';
//import * as pdfFonts from 'pdfmake/build/vfs_fonts';

declare const pdfMake: any;
declare const pdfFonts: any;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

   constructor() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  generateReport(data: any) {
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          text: 'Rapport sur les responsabilités assumées',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: `Code: ${data.code}`, margin: [0, 0, 0, 5] },
                { text: `Nom et Prenom: ${data.fullName}`, margin: [0, 0, 0, 5] },
                { text: `Responsabilité actuelle: ${data.resp}`, margin: [0, 0, 0, 5] },
                { text: `Département: ${data.dept}`, margin: [0, 0, 0, 20] },
                { text: `Grade actuel: ${data.gradeObtenu}`, margin: [0, 0, 0, 20] },
                { text: `Email: ${data.email}`, margin: [0, 0, 0, 20] },
              ]
            }
          ]
        },
        {
          text: 'Liste des responsqbilités assumées',
          style: 'subheader',
          margin: [0, 0, 0, 10]
        },
        this.createTasksTable(data.tasks)
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 14,
          bold: true,
          decoration: 'underline'
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          fillColor: '#f0f0f0'
        }
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }

  private createTasksTable(tasks: any[]) {
    const body = [
      [
        { text: 'Responsabilité', style: 'tableHeader' },
        { text: 'Grade', style: 'tableHeader' },
        { text: 'Département', style: 'tableHeader' },
        { text: 'Date Début', style: 'tableHeader' },
        { text: 'Date Fin', style: 'tableHeader' }
      ]
    ];

    tasks.forEach(task => {
      body.push([
        task.resp,
        task.grade,
        task.dept,
        task.dateDebut,
        task.dateFin
      ]);
    });

    return {
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: body
      },
      layout: {
        hLineWidth: (i: any) => i === 0 ? 1 : 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => '#aaa',
        vLineColor: () => '#aaa',
        paddingLeft: () => 5,
        paddingRight: () => 5,
        paddingTop: () => 3,
        paddingBottom: () => 3
      }
    };
  }
}
