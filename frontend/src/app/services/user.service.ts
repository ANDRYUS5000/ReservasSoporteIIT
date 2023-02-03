import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user
  constructor() {
    this.user=localStorage.getItem('id')
  }

  //método para obtener el id del usuario que ha ingresado al sistema
  getuser(){
    this.user=localStorage.getItem('id')
    return this.user
  }
}
