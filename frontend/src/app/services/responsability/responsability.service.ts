import { Injectable, signal } from '@angular/core';
import { Responsability } from '../../interface/responsability.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsabilityService {
public apiUrl : string= "http://localhost:8089/api/responsabilite"
  private resp=signal<Responsability[]>([]);

  constructor(private http: HttpClient) { }

  getAll(): Observable<Responsability[]> {
  return this.http.get<Responsability[]>(`${this.apiUrl}/liste`).pipe(
    tap(resp => this.resp.set(resp)

  ),
    catchError(error => {
      console.error('Erreur lors de la récupération des departements', error);
      throw error;
    })
  );
}

  getAll1(): Observable<Responsability[]> {
    return this.http.get<{ timeStamp: string; statusCode: number; message: string; data: { responsabilites: Responsability[] } }>(`${this.apiUrl}/liste`)
      .pipe(
        map(response => response.data.responsabilites) // Extraction des départements
      );
  }

  add(resp: FormData): Observable<Responsability| HttpErrorResponse>{
    return this.http.post<Responsability>(`${this.apiUrl}/ajouter`, resp);
  }

  update(code: string, resp: FormData): Observable<Responsability| HttpErrorResponse>{
    return this.http.put<Responsability>(`${this.apiUrl}/update/${code}`,resp);
  }

  getOne(code: string): Observable<Responsability> {
  return this.http.get<Responsability>(`${this.apiUrl}/find/${code}`).pipe(
    catchError(error => {
      console.error('Error fetching department:', error);
      throw error;
    })
  );
}
  delete(code: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/delete/${code}`);
  }

  public createNewResp(currentResp:string, respon: Responsability ): FormData{
    const formData=new  FormData();
    formData.append("currentCode",currentResp);
    formData.append("code",respon.code);
    formData.append("titre",respon.titre);
    return formData;
  }
}
