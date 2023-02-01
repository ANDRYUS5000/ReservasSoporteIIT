import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { IntermediumService } from 'src/app/services/intermedium.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionarespacios',
  templateUrl: './gestionarespacios.component.html',
  styleUrls: ['./gestionarespacios.component.css']
})
export class GestionarespaciosComponent implements OnInit {
  //variable para obtener los tipos de espacios
  tipos:any=[];
 
  //variable para el modelo del tipo de espacio
  espacio={
    name:'',
    tipoesp:'',
    code:0
  };
  //variable con todos los espacios creados
  espacios:any=[];
  
  //método constructor para llamar los servicios y el router
  constructor(public authService:AuthService,
    public intmService:IntermediumService,
    private router:Router) { }

    //Método que se ejecuta al iniciar la página
    ngOnInit(): void {
      //Se valida que el usuario sea Super Admin
      if(this.intmService.esSuperAdmin())
      {
        this.getTipos();
        this.getEspacio();
      }
      //en caso de que no lo sea se lanza un mensaje de error y se cierra sesión
      else{
        Swal.fire("No tiene autorización","","error")
          this.authService.logOut()
          this.router.navigate(['/signin'])
      }
  }

  //Método para obtener los códigos de los tipos de espacios
  getTipos(){
    this.authService.getTEFCode().subscribe(
      res=>{
        this.tipos=res
      },
      err=>console.log(err)
    )
  };

  //Método para obtener el valor seleccionado por el usuario en el espacio nuevo
  onTipo(e:any){
    this.espacio.tipoesp=e.target.value;
  };
  //Método para crear el espacio
  crearEspacio(){
    //Se realiza el llamado de la ruta que contiene el servicio auth y se envia el nuevo espacio
  this.authService.createEspace(this.espacio)
  .subscribe(res=>{
    //Si el espacio no existe se lo crea en la base de datos
    Swal.fire("Registro exitoso","Espacio registrado con éxito","success");
    //Se recarga la página para ver la lista actualizada
    location.reload();
  },
  err=>{console.log(err),
 //si el espacio ya existe se muestra un mensaje de error y no se envía a la base de datos
  Swal.fire("Error","El espacio ya existe","error")
})
  }
  //Permite traer todos los espacios almacenados en la base de datos
  getEspacio(){
  
    this.authService.getEspacios().subscribe(
      res=>{
        this.espacios = res;
        
      },
      err=>console.log(err)
    )
  }

}
