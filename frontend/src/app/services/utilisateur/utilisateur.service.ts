import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Utilisateur } from '../../interface/utilisateur.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CustomHttpResponse } from '../../interface/custom-http-response';

@Injectable({
  providedIn: 'root'
})

export class UtilisateurService {
public apiUrl : string= "http://localhost:8089/api";
  private resp=signal<Utilisateur[]>([]);
  private localStorage: Storage;

  constructor(private http:HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.localStorage = isPlatformBrowser(platformId) ? window.localStorage : {
      getItem: () => null,
      setItem: () => { },
      removeItem: () => { },
      clear: () => { }
    } as unknown as Storage;
  }

getAll():Observable<Utilisateur[]>{
  return this.http.get<Utilisateur[]>(`${this.apiUrl}/user/liste`);
}



  add(prof:Utilisateur): Observable<Utilisateur>{
    return this.http.post<Utilisateur>(`${this.apiUrl}/user/register`, prof);
  }

  update(username: string, resp: Utilisateur): Observable<Utilisateur>{
    return this.http.put<Utilisateur>(`${this.apiUrl}/user/update/${username}`,resp);
  }

  getOne(username: string): Observable<Utilisateur> {
  return this.http.get<Utilisateur>(`${this.apiUrl}/user/get/${username}`).pipe(
    catchError(error => {
      console.error('Error fetching Utilisateur:', error);
      throw error;
    })
  );
}
  locked(username: string): Observable<Utilisateur|HttpErrorResponse>{
    return this.http.put<Utilisateur>(`${this.apiUrl}/user/locked/${username}`,null);
  }




  public addUsersToLocalCache(user: Utilisateur[]):void{
    this.localStorage.setItem('users',JSON.stringify(user));
  }

  public getUsersFromLocalCache():Utilisateur[] | null{
    if(this.localStorage.getItem('users')){
      return JSON.parse(this.localStorage.getItem('users')!);
    }
    return null;
  }

  public resetPassword(username: string):Observable<CustomHttpResponse>{
    return this.http.get<CustomHttpResponse>(this.apiUrl+`/user/resetPassword/${username}`);
  }

  public chagePassword(username:string ,odlPassword: string, password : string):Observable<CustomHttpResponse>{
console.log("OLD: ",odlPassword,"NEW:",password);
    return this.http.post<CustomHttpResponse>(`${this.apiUrl}/user/changePassword/${username}?oldPassword=${odlPassword}&password=${password}`,null);
  }

}
