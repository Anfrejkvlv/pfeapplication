import { Injectable, signal } from '@angular/core';
import { GradeObtenuDTO } from '../../interface/gradeObtenu.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObtenuService {

public apiUrl : string= "http://localhost:8089/api/professeur"
  private resp=signal<GradeObtenuDTO[]>([]);

  constructor(private http: HttpClient) { }

getAll(code:string):Observable<GradeObtenuDTO[]>{
  return this.http.get<GradeObtenuDTO[]>(`${this.apiUrl}/code/${code}/grade-obtenus`);
}

  add(code:string,grade:GradeObtenuDTO): Observable<GradeObtenuDTO>{
    return this.http.post<GradeObtenuDTO>(`${this.apiUrl}/attribuer-grade/${code}`, grade);
  }

  update(code: string,gradeId:number, grade: GradeObtenuDTO): Observable<GradeObtenuDTO| HttpErrorResponse>{
    return this.http.put<GradeObtenuDTO>(`${this.apiUrl}/code/${code}/grade-obtenus/${gradeId}`,grade);
  }

  getOne(code: string,idResp:number): Observable<GradeObtenuDTO> {
  return this.http.get<GradeObtenuDTO>(`${this.apiUrl}/${code}`).pipe(
    catchError(error => {
      console.error('Error fetching GradeObtenuDTO:', error);
      throw error;
    })
  );
}
  delete(code: string,gradeId:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/code/${code}/grade-obtenu/${gradeId}`);
  }
}
