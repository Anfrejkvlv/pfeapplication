import { Injectable, signal } from '@angular/core';
import { Professeur } from '../../interface/professeur.interface';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesseurService {

public apiUrl : string= "http://localhost:8089/api/professeur"
  private resp=signal<Professeur[]>([]);

  constructor(private http: HttpClient) { }
getAll():Observable<Professeur[]>{
  return this.http.get<Professeur[]>(`${this.apiUrl}/liste`);
}



  add(prof:Professeur): Observable<Professeur>{
    return this.http.post<Professeur>(`${this.apiUrl}/ajouter`, prof);
  }

  update(cin: string, resp: Professeur): Observable<Professeur| HttpErrorResponse>{
    return this.http.put<Professeur>(`${this.apiUrl}/${cin}`,resp);
  }

  getOne(code: string): Observable<Professeur> {
  return this.http.get<Professeur>(`${this.apiUrl}/${code}`).pipe(
    catchError(error => {
      console.error('Error fetching Professeur:', error);
      throw error;
    })
  );
}
  delete(code: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${code}`);
  }

}
