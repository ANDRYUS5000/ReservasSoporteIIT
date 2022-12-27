import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user=localStorage.getItem('id')
  constructor() { }

  getuser(){
    return this.user
  }
}
