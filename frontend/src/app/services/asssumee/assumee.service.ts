import { Injectable, signal } from '@angular/core';
import { RespAssumeDTO } from '../../interface/respAssumee.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssumeeService {

public apiUrl : string= "http://localhost:8089/api/professeur";
public apiUrl1 : string= "http://localhost:8089/api/professeurs";
  private resp=signal<RespAssumeDTO[]>([]);

  constructor(private http: HttpClient) { }

getAll(code:string):Observable<RespAssumeDTO[]>{
  return this.http.get<RespAssumeDTO[]>(`${this.apiUrl}/code/${code}/responsabilites-assumees`);
}

  add(code:string,resp:RespAssumeDTO): Observable<RespAssumeDTO>{
    return this.http.post<RespAssumeDTO>(`${this.apiUrl}/attribuer-resp/${code}`, resp);
  }

  update(code: string,idResp:number, resp: RespAssumeDTO): Observable<RespAssumeDTO| HttpErrorResponse>{
    return this.http.put<RespAssumeDTO>(`${this.apiUrl}/code/${code}/responsabilites-assumees/${idResp}`,resp);
  }

  getOne(code: string,idResp:number): Observable<RespAssumeDTO> {
  return this.http.get<RespAssumeDTO>(`${this.apiUrl1}/${code}/responsabilites-assumees/assumee/${idResp}`).pipe(
    catchError(error => {
      console.error('Error fetching RespAssumeDTO:', error);
      throw error;
    })
  );
}
  delete(code: string,idResp:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/code/${code}/responsabilites-assumees/${idResp}`);
  }

}
