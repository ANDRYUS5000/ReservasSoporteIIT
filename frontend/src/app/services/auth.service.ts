import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Router } from '@angular/router';
import { UserService } from './user.service';
import {of} from 'rxjs'
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL='http://localhost:3000/api'

  constructor(private http:HttpClient,
    private router:Router,
    private ususer:UserService
  ) {}

  opts = [];

  getData() {
    return this.opts.length ?
      of(this.opts) :
      this.http.get<any>(this.URL+'/auth/tipoespfis')
        .pipe(
          tap(data => {
            this.opts = data
          }),
        )
  }

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
    return this.http.get<string[]>(this.URL+'/auth/tipoespfis');
  }
  getTEFCode(){
    return this.http.get<string[]>(this.URL+'/auth/tipoEspFisCode');
  }
  getEspacios(){
    return this.http.get(this.URL+'/auth/espacios');
  }
}
