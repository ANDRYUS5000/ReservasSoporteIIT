import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user={_id:'',
                name:'',
                ced:'',
                roles:'',
                dependencia:'',
                email:'',
                password:'',
                telefono:''}
  constructor() { }

  setuser (usu:any){
    this.user=usu
  }

  getuser(){
    return this.user
  }
}
