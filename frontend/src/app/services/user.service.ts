import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user
  constructor() {
    this.user=localStorage.getItem('id')
  }

  getuser(){
    this.user=localStorage.getItem('id')
    return this.user
  }
}
