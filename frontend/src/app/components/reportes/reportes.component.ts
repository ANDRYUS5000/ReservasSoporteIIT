import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import Swal from 'sweetalert2';
import { IntermediumService } from 'src/app/services/intermedium.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  //variable para declarar el modelo de la dependencia
  dependencia={
    _id:'',
    id_unidad:'',
    nombre_unidad:'',
    id_tipo_unidad:'',
    tipo_unidad:''
  }
  //variable para almacenar todas las dependencias existentes
  dependencias=[this.dependencia]
  //variable para declarar el modelo de las reservas a almacenar
  reservas=[{_id:'',
            fini:'', 
            fend:'', 
            namevent:'', 
            user:{name:'',
                  ced:'',
                  roles:[],
                  dependencia:[this.dependencia],
                  email:'',
                  telefono:''}, 
                  sitio: {
                    name:'',
                    tipo:''
                  },
            state:'', 
            anexo:'',
            createdAt:new Date}]

  //Arreglo de reservas auxiliares
  reservaux=[{_id:'',
            fini:'', 
            fend:'', 
            namevent:'', 
            user:{name:'',
                  ced:'',
                  roles:[],
                  dependencia:[this.dependencia],
                  email:'',
                  telefono:''}, 
            sitio: {
              name:'',
              tipo:''
            },
            state:'', 
            anexo:'',
            createdAt:new Date}]
  
  //Método constructor para llamar los servicios
  constructor(private reseserver:ReservasAdminService,
              private authService:AuthService,
              private intmService:IntermediumService,
              private router:Router) { }

  //Método que se inicializa al cargar la página
  ngOnInit(): void {
    //solo se carga el contenido si el usuario es Admin o SuperAdmin
    if(!this.intmService.esUser())
    {
      //Se obtienen todas las reservas
    this.reseserver.getReservas()
    .subscribe(
      res=>{
        this.reservas=res;
        //se ordenan las reservas por fecha de creación
        this.reservas.sort((a,b)=>{
          return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
        })
        //se almacenan en la variable auxiliar
        this.reservaux=[...this.reservas]
       
      }
    )
    //se obtienen las dependencias
    this.authService.getDependencias().subscribe(
      res => {
        //se agrega cada una de las dependencias de la base de datos al arreglo
        for (let i of Object.values(res)) {
          this.dependencias.push(i);
        }
        
      },
      err => console.log(err)
    );
 
    }
    //si el usuario es USER se lanza mensaje de error en permisos y se cierra sesión
    else{
      Swal.fire("No tiene autorización","","error")
        this.authService.logOut()
        this.router.navigate(['/signin'])
     }

   }

   //Método para modificar el estado de una reserva a probado
  resmoda(id:string){
    //Se envía el id de la reserva a actualizar
    this.reseserver.UpdateStateA(id)
    .subscribe(
      res=>{
      this.reservas=res
      this.reservas.sort((a,b)=>{
        return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
      })
      //Se lanza un mensaje para que el Admin notifique al usuario
      Swal.fire("Reserva Aprobada","No se olvide de contactar al usuario y notificar la aprobación","success")
      this.reservaux=this.reservas
    })
  }
  //Método para modificar el estado de una reserva a solicitado
  resmods(id:string){
     //Se envía el id de la reserva a actualizar
    this.reseserver.UpdateStateS(id)
    .subscribe(
      res=>{
      this.reservas=res
      this.reservas.sort((a,b)=>{
        return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
      })
      //Se lanza un mensaje para que el Admin notifique al usuario
      
      Swal.fire("Reserva Modificada","No se olvide notificar la modificación","success")

      this.reservaux=this.reservas
    })
  }
  //Método para modificar el estado de una reserva a no aprobado
  resmodr(id:string){
    //Se envía el id de la reserva
    this.reseserver.UpdateStateR(id)
    .subscribe(
      res=>{
      this.reservas=res
      this.reservas.sort((a,b)=>{
        return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
      })
      Swal.fire("Reserva No Aprobada","No se olvide de contactar al usuario y notificar el rechazo","error")
      this.reservaux=this.reservas
    })
  }

  //Método para descargar el documento anexo de cada reserva
  async Down(id:string){
    await (await this.reseserver.Download(id)).subscribe()
  }

  //Método para mostrar las reservas pertenecientes a una facultad específica
  onFacultad($e:any){
    if ($e.target.value!='') {
      this.reservaux=this.reservas.filter(r=>r.user.dependencia[0].nombre_unidad==$e.target.value)
    }else{
      this.reservaux=this.reservas
    }
  }
  
}

