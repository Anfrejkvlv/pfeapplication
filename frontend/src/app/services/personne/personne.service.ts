import { Injectable, signal } from '@angular/core';
import { Personne } from '../../interface/personne.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, map, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CustomHttpResponse } from '../../interface/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {
public apiUrl : string= "http://localhost:8089/api/personne"
  private resp=signal<Personne[]>([]);

  constructor(private http: HttpClient, private d: DatePipe) { }
   getAll(): Observable<Personne[]> {
    return this.http.get<{ timeStamp: string; statusCode: number; message: string; data: { personnes: Personne[] } }>(`${this.apiUrl}/liste`)
      .pipe(
        map(response => response.data.personnes) // Extraction des départements
      );
  }

  getP():Observable<CustomHttpResponse>{
    return this.http.get<CustomHttpResponse>(`${this.apiUrl}/liste`).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  }
  private handleError(error:HttpErrorResponse):Observable<never>{
    console.log(error);
    let errorMessage:string;
    if(error.error instanceof ErrorEvent){
      errorMessage=`A client error occured - ${error.error.message}`;
    }else{
      if(error.error.reason){
        errorMessage= `${error.error.reason} - Error code ${error.status}`;
      }else{
        errorMessage= `An error occured - Error code ${error.status}`
      }
    }
    return throwError(errorMessage);
  }
  add(resp: FormData): Observable<Personne| HttpErrorResponse>{
    return this.http.post<Personne>(`${this.apiUrl}/ajouter`, resp);
  }
/*
  add(pers:Personne): Observable<Personne>{
    return this.http.post<Personne>(`${this.apiUrl}/ajouter`, pers);
  }*/

  update(cin: string, resp: FormData): Observable<Personne| HttpErrorResponse>{
    return this.http.put<Personne>(`${this.apiUrl}/update/${cin}`,resp);
  }

  getOne(cin: string): Observable<Personne> {
  return this.http.get<Personne>(`${this.apiUrl}/find/${cin}`).pipe(
    catchError(error => {
      console.error('Error fetching department:', error);
      throw error;
    })
  );
}
  delete(cin: string): Observable<CustomHttpResponse|HttpErrorResponse>{
    return this.http.delete<CustomHttpResponse|HttpErrorResponse>(`${this.apiUrl}/delete/${cin}`);
  }

  public createNewPerson(currentCIN:string, respon: Personne): FormData{
    const formData=new  FormData();
    formData.append('currentCIN',currentCIN);
    formData.append('cin',respon.cin!);
    formData.append('nom',respon.nom!);
    formData.append('prenom',respon.prenom!);
    formData.append('email',respon.email!);
    formData.append('sexe',respon.sexe!);
    formData.append("telephone",respon.telephone!);
    const dateString=this.d.transform( respon.dateNaissance,'yyyy-MM-dd');
    formData.append('dateNaissance',dateString!);
    return formData;
  }
}
