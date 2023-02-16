import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Router } from '@angular/router';

import {of} from 'rxjs'
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 //se especifica la dirección para que haya conexión con el backend
  private URL='http://localhost:3000/api'
//se crean instancias de Http y router
  constructor(private http:HttpClient,
    private router:Router,
    
  ) {}

  opts:any = [];

  //Método para obtener los tipos de espacios físicos
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
//conexión para realizar el registro de usuario, se debe especificar la url y enviar el usuario
   signUp(user:any){
   return this.http.post<any>(this.URL+'/auth/signup',user);
  }
  //conexión para realizar el ingreso al sistema, se debe especificar la url y enviar el usuario
  login(user:any){
   return this.http.post<any>(this.URL+'/auth/signin',user);
  }
  //conexión para verificar si el usuario ha ingresado al sistema, para eso se obtiene el token
  loggedIn():Boolean{
    return !!localStorage.getItem('token')
  }
  //Método para extraer el token del localstorage
  getToken(){
    return localStorage.getItem('token')
  }
  //se especifica la ruta para que el Super Admin registre el usuario y se envía el user
  registerUser(user:any){
    return this.http.post<any>(this.URL+'/auth/registeruser',user);
  }
  //se especifica la ruta para que el Super Admin registre un espacio y se envía el espacio
  createEspace(espacio:any){
    return this.http.post<any>(this.URL+'/auth/crearespacio',espacio);
  }
  //método para cerrar sesión, se eliminan las variables del localStorage y se redirige al inicio
  logOut(){
    localStorage.clear()
    this.router.navigate(['/home']);
  }
  //ruta para obtener las dependencias 
  getDependencias(){
    return this.http.get(this.URL +'/auth/dependencias');
  }
  //ruta para obtener los roles
  getRoles(){
    return this.http.get(this.URL +'/auth/roles');
  }
  //ruta para obtener los tipos de espacios físicos 
  getTiposEspFis(){
    return this.http.get<string[]>(this.URL+'/auth/tipoespfis');
  }
  //ruta para obtener loscódigos de los tipos de espacios físicos 
  getTEFCode(){
    return this.http.get<any>(this.URL+'/auth/tipoEspFisCode');
  }
  //ruta para obtener los espacios físicos
  getEspacios(){
    return this.http.get<any>(this.URL+'/auth/espacios');
  }
}
