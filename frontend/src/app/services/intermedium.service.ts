import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { Router } from '@angular/router';
import { UserService } from './user.service';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class IntermediumService {

  //variable para el tipo de usuario
  tipo_user='';
  //variable para la dependencia
  dependencia='';
  //constructor para instanciar variables del authService y el router
  constructor(private authService:AuthService,
              private router:Router,
              private ususer:UserService
              ) { }

  //método para el ingreso del usuario al sistema
  login(user:any){
    
    this.authService.login(user)
    .subscribe(
      //una vez se ejecuta se obtiene el token, el rol del usuario y el id
      res=>{
        //Se almacena en el localStorage los datos enviados en formato JSON por el backend
        localStorage.setItem('token',res.token);
        localStorage.setItem('roles',res.roles);
        localStorage.setItem('id', res.id);
        //se asigna el rol a la variable tipo_user y la dependencia
        this.tipo_user=res.roles;
        this.dependencia=res.dependencia;
        //si el rol es User se redirige a la pestaña de reservas
        if(localStorage.getItem('roles')==='USER')
        {
          this.router.navigate(['/reservas'])
        }
        //si el rol es Admin se redirige a la pestaña de admin
        else if(localStorage.getItem('roles')==='ADMIN')
        {
          this.router.navigate(['/reportes'])
        }
        //de lo contrario se asume que es Super Admin y se redirige a la pestaña de registrar usuario
        else
          this.router.navigate(['/registeruser'])
      },
      //si la clave es incorrecta o el usuario no ha sido encontrado se lanza una alerta
       err=>{console.log(err),
        Swal.fire("Error con el usuario o la clave","Ingrese nuevamente los datos","error")}
    );
  }
//Método para validar si el rol es tipo User
esUser(){
  if(localStorage.getItem('roles')==='USER')
  {
    //si lo es se retorna true
    return true;
  }
  //de lo contrario se retorna false
  else return false;
}
//Método para validar si el rol es Admin
esAdmin(){
  if(localStorage.getItem('roles')==='ADMIN')
  {
    //si lo es retorna true
    return true;
  }
  //de lo contrario false
  else return false;
}
//Método para validar si el rol es Super Admin
esSuperAdmin(){
  if(localStorage.getItem('roles')==="SUPERA")
  {
    //si lo es retorna true
    return true;
  }
  //de lo contrario false
  else return false;
} 
//Método para obtener el id del usuario
getid():String{
  let id = localStorage.getItem('id')
  if (id) {
      return id
    }
  else{
      return ""
    }
  }


}
