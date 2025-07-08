import { Departement } from '../../interface/departement.interface';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  public apiUrl : string= "http://localhost:8089/api/departement"
  private dept=signal<Departement[]>([]);

  constructor(private http: HttpClient) { }
    getAll(): Observable<Departement[]> {
    return this.http.get<{ timeStamp: string; statusCode: number; message: string; data: { deparments: Departement[] } }>(`${this.apiUrl}/liste`)
      .pipe(
        map(response => response.data.deparments) // Extraction des départements
      );
  }

  add(dpt: FormData): Observable<Departement| HttpErrorResponse>{
    return this.http.post<Departement>(`${this.apiUrl}/ajouter`, dpt);
  }

  update(code: string, dpt: FormData): Observable<Departement| HttpErrorResponse>{
    return this.http.put<Departement>(`${this.apiUrl}/update/${code}`,dpt);
  }

  getOne(code: string): Observable<Departement> {
  //console.log('Fetching department with code:', code);
  return this.http.get<Departement>(`${this.apiUrl}/find/${code}`).pipe(
    //tap(dept => console.log('Received data:', dept)),
    catchError(error => {
      console.error('Error fetching department:', error);
      throw error;
    })
  );
}

getOneById(id: number): Observable<Departement> {
  //console.log('Fetching department with code:', code);
  return this.http.get<Departement>(`${this.apiUrl}/${id}`).pipe(
    //tap(dept => console.log('Received data:', dept)),
    catchError(error => {
      console.error('Error fetching department:', error);
      throw error;
    })
  );
}
  delete(code: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/delete/${code}`);
  }

  public createNewDept(currentDpt:string, departement: Departement ): FormData{
    const formData=new  FormData();
    formData.append("currentDept",currentDpt);
    formData.append("code",departement.code);
    formData.append("nom",departement.nom);
    return formData;
  }

}
