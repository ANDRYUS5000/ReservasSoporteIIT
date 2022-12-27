import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {Router} from '@angular/router';
import { IntermediumService } from 'src/app/services/intermedium.service';

@Component({
  selector: 'app-crearusuarios',
  templateUrl: './crearusuarios.component.html',
  styleUrls: ['./crearusuarios.component.css']
})
export class CrearusuariosComponent implements OnInit {

  mensaje="";
  bandera=false;
  user={
     name:'',
     ced:'',   
     roles:[''], 
     dependencia:'',
     email : '',
     password:'',
     telefono:''
   }
   dependencias: any = [];
   roles: any = [];
   constructor(public authService:AuthService,
     
     private router:Router,
     public intmService:IntermediumService,
     ) { 
 
   }
 
   ngOnInit(): void {
     this.getDependencias();
     this.getRoles();
   }
 
   onFacultad(e: any) {
     this.user.dependencia = e.target.value;
 }
 
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
 
   onRole(e: any) {
     this.user.roles=[e.target.value];
                 };
   signUp(){
     if(this.user.email.indexOf("@udenar.edu.co")!==-1)
     {
       this.authService.registerUser(this.user)    
       .subscribe(
         res=>{        
          this.mensaje="Usuario registrado con éxito";
          this.user.ced='';
          this.user.dependencia='';
          this.user.email='';
          this.user.name='';
          this.user.password='';
          this.user.roles=[];
          this.user.telefono='';

         },
         err=>console.log(err)
       )
     }
     else(
       this.bandera=true,
       this.mensaje="Email inválido, debe ingresar un correo con el dominio @udenar.edu.co"
       
     )
     
   }

}
