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

  bandera=false;
  user={
    name:'',
    ced:'', 
    dependencia:'',
    email : '',
    password:'',
    telefono:''
  }
  dependencias: any = [];
  constructor(public authService:AuthService,
    
    private router:Router,
    public intmService:IntermediumService,
    ) { 

  }

  ngOnInit(): void {
    this.getDependencias();
  }

onFacultad($e:any){
  
  this.user.dependencia=$e.target.value
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

  signUp(){
    if(this.user.email.indexOf("@udenar.edu.co")!==-1)
    {
      this.authService.signUp(this.user)    
      .subscribe(
        res=>{
          Swal.fire("Exito","Su usario se a registrado correctamente","success")
          this.router.navigate(['/signin']);
        },
        err=>console.log(err)
      )
    }
    else(
      Swal.fire("Error","Email inválido, debe ingresar un correo con el dominio @udenar.edu.co","error")
    )
  }

}
