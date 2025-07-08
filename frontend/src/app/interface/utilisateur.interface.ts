import { Role } from "../enumeration/role.enum";

export class Utilisateur{
 /* id: number;
  userId: string;
  username: string;
  password: string;
  role: string;
  isActive: boolean;
  notLocked: boolean;
  authorities: [];
  joinedDate: Date;
  lastLoginDate: Date;
  nom: string;
  prenom: string;
  email: string;
  cin: string;
  dateNaissance: string;
  sexe: string;
  telephone: string;
*/

  id!: number;
  userId!: string;
  username: string;
  password!: string;
  role: string;
  isActive: boolean;
  notLocked: boolean;
  authorities: [];
  joinedDate!: Date;
  lastLoginDate!: Date;
  nom: string;
  prenom: string;
  email: string;
  cin!: string;
  dateNaissance!: string;
  sexe!: string;
  telephone!: string;



    constructor(){
        this.nom='';
        this.prenom='';
        this.username='';
        this.email='';
        this.isActive=false;
        this.notLocked=false;
        this.role='';
        this.authorities=[];
    }
}
