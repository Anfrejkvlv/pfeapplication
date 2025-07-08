import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { Utilisateur } from '../interface/utilisateur.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  private localStorage: Storage;
  private token!: string | null;
  public loggedInUsername!: string | null;
  private jwtHelper= new JwtHelperService();
  public verif:boolean=false;

  constructor(private http:HttpClient,@Inject(PLATFORM_ID) private platformId: Object ) {
      this.localStorage = isPlatformBrowser(platformId) ? window.localStorage : {
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
        clear: () => { }
      } as unknown as Storage;
  }
  ngOnInit(): void {

    this.getToken();
    this.isLoggedIn();
  }

  public login(user: Utilisateur):Observable<HttpResponse<Utilisateur>>{
    console.log("USER=>",user)
    return this.http.post<Utilisateur>
    ("http://localhost:8089/api/user/login",user,{observe:'response'})
  }


  register(user: Utilisateur):Observable<Utilisateur>{
    return this.http.post<Utilisateur>
    ("http://localhost:8089/api/user/register",user)
  }

  public logout(): void{
    this.token=null;
    this.loggedInUsername=null;
    this.localStorage.removeItem("user");
    this.localStorage.removeItem("token");
    this.localStorage.removeItem("users");
  }

    public saveToken(token:string): void{
    this.token=token;
    this.localStorage.setItem("token", token);
  }
  public addUserToLocalCache(user: Utilisateur): void{
    this.localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCahe(): Utilisateur | null{
    const userString = this.localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  public loadToken(): void{
    this.token=this.localStorage.getItem('token');
  }

  public getToken(): string |null{
    return this.token;
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true; // Si pas de token, considéré comme expiré

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // `exp` est en secondes
    return Date.now() >= expirationTime;
}

  public isLoggedIn(): boolean{
    this.loadToken();
    if(!this.token){
      this.logout();
      return false;
    }
        const decodedToken = this.jwtHelper.decodeToken(this.token!);
        const username = decodedToken?.sub;

        if (username && !this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = username;
          return true;
        }
      this.logout();
      return false;
  }




}
