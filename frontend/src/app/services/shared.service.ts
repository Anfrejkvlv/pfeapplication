import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Utilisateur } from '../interface/utilisateur.interface';
import { Role } from '../enumeration/role.enum';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SharedService implements OnInit{
user: Utilisateur|null|undefined;

  constructor(private auhtService:AuthService, private notif:ToastrService) { }
  ngOnInit(): void {
    this.user=this.auhtService.getUserFromLocalCahe();
    throw new Error('Method not implemented.');
  }


    public getUserRole():string{
    return this.auhtService.getUserFromLocalCahe()!.role;
  }

  public hasRole(role:string){
    return this.getUserRole()==role;
  }

  public get isAdmin():boolean{
    console.log("ROLE: ",this.getUserRole());
    return this.getUserRole()==Role.ADMIN;
  }

  public get isAdminAndEmp():boolean{
    return this.getUserRole()==Role.ADMIN || this.getUserRole()==Role.GESTIONNAIRE;
  }

  public get isJury():boolean{
    return this.getUserRole()==Role.JURY;
  }

public sendWarning():void{
  this.notif.warning("Vos authorisation ne vous permettent pas d'effectuer cette action","AVERTISSMENT");
}

}
