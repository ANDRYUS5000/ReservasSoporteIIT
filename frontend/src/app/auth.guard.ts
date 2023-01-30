import { Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public authService:AuthService,
    private router:Router){

  }
  //Método para validar si el usuario ha iniciado sesión para acceder a las rutas de su respectivo rol
    canActivate():boolean{
    if (this.authService.loggedIn()){
      return true;
    }
    //si no ha iniciado sesión, se lo redirige a la pestaña de ingreso
        this.router.navigate(['/signin'])
    return false;
  }
 

  
  
}
