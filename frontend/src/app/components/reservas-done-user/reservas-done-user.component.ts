import { Component, OnInit } from '@angular/core';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { IntermediumService } from 'src/app/services/intermedium.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reservas-done-user',
  templateUrl: './reservas-done-user.component.html',
  styleUrls: ['./reservas-done-user.component.css']
})
export class ReservasDoneUserComponent implements OnInit {

  
  //variable para declarar el modelo de dependencia
  dependencia = {
    _id: '',
    id_unidad: '',
    nombre_unidad: '',
    id_tipo_unidad: '',
    tipo_unidad: ''
  }
  //Arreglo de dependencias
  dependencias = [this.dependencia]
  //Arreglo para declarar el modelo de cada reserva
  reservas = [{
    _id: '',
    fini: '',
    fend: '',
    namevent: '',
    user: {
      name: '',
      ced: '',
      roles: [],
      dependencia: [this.dependencia],
      email: '',
      telefono: ''
    },
    sitio: {
      name:'',
      tipo:''
    },
    state: '',
    anexo: '',
    createdAt: new Date
  }]
  //Arreglo auxiliar de reservas
  reservaux = [{
    _id: '',
    fini: '',
    fend: '',
    namevent: '',
    user: {
      name: '',
      ced: '',
      roles: [],
      dependencia: [this.dependencia],
      email: '',
      telefono: ''
    },
    sitio: {
      name:'',
      tipo:''
    },
    state: '',
    anexo: '',
    createdAt: new Date
  }]
  //variable para obtener el id del usuario loggueado
  idUser: any = ''

  //Método para instanciar los servicios
  constructor(private reseserver: ReservasAdminService,
    private userService: UserService,
    private router:Router,
    private intmService:IntermediumService,
    private authService:AuthService) {
    this.idUser = this.userService.getuser()
  }


//Método que se ejecuta al inicializar la página
  ngOnInit(): void {
    //solo se muestra el contenido si el rol es USER
    if(this.intmService.esUser())
    {
      //se obtienen las reservas del usuario enviando el id
      this.reseserver.GetReservasUser(this.idUser)
      .subscribe(
        res => {
          this.reservas = res;
          this.reservas.sort((a, b) => {
            return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
          })
          this.reservas.sort((a, b) => {
            if (a.state < b.state) { return -1; }
            if (a.state > b.state) { return 1; }
            else return 0
          })
          this.reservaux=[...this.reservas]
        }
      )
    }
    //en caso contrario se muestra mensaje de error y se cierra sesión
    else{
      Swal.fire("No tiene autorización","","error")
          this.authService.logOut()
          this.router.navigate(['/signin'])
    }
  }

  //Método para filtrar las reservas por estado y mostrarlas en la página
  onState($e:any)
  {
    if($e!=''){
      this.reservaux=this.reservas.filter(reserva=>reserva.state==$e)
    }
    else{
      this.reservaux=this.reservas
    }
  }
 
  //Método para validar si las reservas indicadas al usuario tienen estado
  //diferente a cancelado
  noCancelado():boolean
  {
    if(this.reservaux.length!=0)
    {
      if (this.reservaux[0].state!='cancelado') {
        return true
      }
    }
    return false
  } 
  
  //Método para eliminar reservas, solo aplica para solicitadas
  //y para no aprobadas
  removeReserva(id: string) {
    this.reseserver.removeReserva(id).subscribe(
      res => {
        console.log(res)
      }
    );
    //Se recargan las reservas
    location.reload()
  }

  //Método para realizar la cancelación de una reserva aprobada
  cancelReserva(id: string) {
    //Primero se lanza una ventana para que el usuario
    //Confirme si desea o no cancelar la reserva
    Swal
      .fire({
        text: "¿Desea cancelar la reserva?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
      .then(resultado =>//si confirma la cancelación
         {
        if (resultado.value) {
          //se actualiza el estado de la reserva a cancelado
          this.reseserver.UpdateStateCancel(id)
            .subscribe(
              res => {
                //Se muestra una nueva alerta con el resultado de la operación
                Swal.fire("Cancelación","Reserva Cancelada","error")
                this.reservas = res
                this.reservas.sort((a, b) => {
                  return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
                })

                this.reservaux = this.reservas
              })
        }
      });

  }
}
