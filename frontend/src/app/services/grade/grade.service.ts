import { Injectable, signal } from '@angular/core';
import { Grade } from '../../interface/grade.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
public apiUrl : string= "http://localhost:8089/api/grade"
  private dept=signal<Grade[]>([]);

  constructor(private http: HttpClient) { }

    getAll(): Observable<Grade[]> {
    return this.http.get<{ timeStamp: string; statusCode: number; message: string; data: { grades: Grade[] } }>(`${this.apiUrl}/liste`)
      .pipe(
        map(response => response.data.grades)
      );
  }

  add(dpt: FormData): Observable<Grade| HttpErrorResponse>{
    return this.http.post<Grade>(`${this.apiUrl}/ajouter`, dpt);
  }

  update(code: string, dpt: FormData): Observable<Grade| HttpErrorResponse>{
        console.log("DATA: ",dpt);

    return this.http.put<Grade>(`${this.apiUrl}/update/${code}`,dpt);
  }

  getOne(code: string): Observable<Grade> {
  return this.http.get<Grade>(`${this.apiUrl}/find/${code}`).pipe(
    tap(dept => console.log('Received data:', dept)),
    catchError(error => {
      console.error('Error fetching department:', error);
      throw error;
    })
  );
}
  delete(code: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/delete/${code}`);
  }

  public createNewGrade(currentG:string, grade: Grade ): FormData{
    const formData=new  FormData();
    formData.append("currentGrade",currentG);
    formData.append("code",grade.code);
    formData.append("grade",grade.grade);
    return formData;
  }
}
