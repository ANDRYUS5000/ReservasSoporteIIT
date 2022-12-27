import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Router } from '@angular/router';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL='http://localhost:3000/api'

  constructor(private http:HttpClient,
    private router:Router,
    private ususer:UserService
    ) {}

  signUp(user:any){
   return this.http.post<any>(this.URL+'/auth/signup',user);
  }
  login(user:any){
   return this.http.post<any>(this.URL+'/auth/signin',user);
  }
  loggedIn():Boolean{
    return !!localStorage.getItem('token')
  }
  getToken(){
    return localStorage.getItem('token')
  }
  registerUser(user:any){
    return this.http.post<any>(this.URL+'/auth/registeruser',user);
  }
  createEspace(espacio:any){
    return this.http.post<any>(this.URL+'/auth/crearespacio',espacio);
  }
  logOut(){
    localStorage.clear()
    this.router.navigate(['/home']);
  }
  getDependencias(){
    return this.http.get(this.URL +'/auth/dependencias');
  }
  getRoles(){
    return this.http.get(this.URL +'/auth/roles');
  }
  getTiposEspFis(){
    return this.http.get(this.URL+'/auth/tipoespfis');
  }
  getEspacios(){
    return this.http.get(this.URL+'/auth/espacios');
  }
}
