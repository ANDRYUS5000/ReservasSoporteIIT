import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {Router} from '@angular/router';
import { IntermediumService } from 'src/app/services/intermedium.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crearusuarios',
  templateUrl: './crearusuarios.component.html',
  styleUrls: ['./crearusuarios.component.css']
})
export class CrearusuariosComponent implements OnInit {

 //se crea la variable usuario
  user={
     name:'',
     ced:'',   
     roles:[''], 
     dependencia:'',
     email : '',
     password:'',
     telefono:''
   }
   //se crea la variable de depedencias
   dependencias: any = [];
    //se crea la variable de roles
   roles: any = [];
   //método constructor para instanciar los servicios y el enrutador
   constructor(public authService:AuthService,
     
     private router:Router,
     public intmService:IntermediumService,
     ) { 
 
   }
 
   //método que se ejecuta apenas se inicia la pestaña
   ngOnInit(): void {
    //solo se ejecuta si el usuario es super Admin
    if(this.intmService.esSuperAdmin())
    {
      this.getDependencias();
      this.getRoles();
    }
    //De lo contrario se lanza un mensaje de error y se cierra la sesión
    else{
      Swal.fire("No tiene autorización","","error")
      this.authService.logOut()
      this.router.navigate(['/signin'])
    }
    
   }
   //método para obtener el valor seleccionado en la dependencia del nuevo usuario
 
   onFacultad(e: any) {
     this.user.dependencia = e.target.value;
 }
  //método para traer las dependencias
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
 //método para obtener los roles
   getRoles(){
     this.authService.getRoles().subscribe(
       res => {
         for(let i of Object.values(res)){
           this.roles.push(i);
         }
        
       },
       err=>console.log(err)
     )
   };
 //método para obtener el rol seleccionado por el Super Admin
   onRole(e: any) {
     this.user.roles=[e.target.value];
                 };
  //Método para registrar el usuario
   signUp(){
    //se valida si el correo es del dominio udenar.edu.co
     if(this.user.email.indexOf("@udenar.edu.co")!==-1)
     {
       //se ejecuta el método del servicio enviado al user
       this.authService.registerUser(this.user)    
       .subscribe(
         res=>{        
          //se registra al usuario y se lanza un mensaje de éxito
          Swal.fire("Registro exitoso","El usuario fue registrado","success")  
          //luego se limpian todos los campos
          this.user.ced='';
          this.user.dependencia='';
          this.user.email='';
          this.user.name='';
          this.user.password='';
          this.user.roles=[];
          this.user.telefono='';

         },
         //en caso de error se muestra el error por consola
         err=>Swal.fire("Error","El usuario ya existe","error")
       )
     }
     else(
       //si el correo no es de dominio udenar.edu.co se lanza un mensaje de error
       Swal.fire("Error","Email inválido, debe ingresar un correo con el dominio @udenar.edu.co","error")
     )
     
   }

}
