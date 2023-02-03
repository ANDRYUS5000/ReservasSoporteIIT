import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {Router} from '@angular/router';
import { IntermediumService } from 'src/app/services/intermedium.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

   //Variable para declarar el modelo de usuario a registrar
  user={
    name:'',
    ced:'', 
    dependencia:'',
    email : '',
    password:'',
    telefono:''
  }
  //arreglo de dependencias
  dependencias: any = [];
   //Método constructor para instanciar los servicios
  constructor(public authService:AuthService,    
    private router:Router,
    public intmService:IntermediumService,
    ) { 

  }
//Método para cargar las dependencias al cargar la página
  ngOnInit(): void {
    this.getDependencias();
  }
//Método para obtener la dependencia seleccionada por el usuario
onFacultad($e:any){
  
  this.user.dependencia=$e.target.value
}
//Método para obtener todas las dependencias almacenadas en la base de datos
  getDependencias() {
    
    this.authService.getDependencias().subscribe(
      res => {
        
        for (let i of Object.values(res)) {
          this.dependencias.push(i);
        }
        
      },
      err => console.log(err)
    );
  };
  //Método para registrar un usuario
  signUp(){
    //Se valida que el correo tenga el dominio perteneciente a @udenar.edu.co
    if(this.user.email.indexOf("@udenar.edu.co")!==-1)
    {
      //se envía el usuario y se ejecuta la función empleando el servicio
      this.authService.signUp(this.user)    
      .subscribe(
        res=>{
          //Si no hay error en el registro del usuario se lanza este mensaje
          Swal.fire("Exito","Su usuario se ha registrado correctamente","success")
          this.router.navigate(['/signin']);
        },
        //en caso de que el correo o la cédula ya estén registrados en la base de datos, no se registra el usuario
        //y se lanza este mensaje
        err=>Swal.fire("Error","El correo y/o cédula ya existen, por favor verifique sus datos","error")
      )
    }
    //si el correo introducido no tiene un dominio válido se lanza este mensaje
    else(
      Swal.fire("Error","Email inválido, debe ingresar un correo con el dominio @udenar.edu.co","error")
    )
  }

}
