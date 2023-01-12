import { Type } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservas-done-user',
  templateUrl: './reservas-done-user.component.html',
  styleUrls: ['./reservas-done-user.component.css']
})
export class ReservasDoneUserComponent implements OnInit {

  

  mensaje = ''
  dependencia = {
    _id: '',
    id_unidad: '',
    nombre_unidad: '',
    id_tipo_unidad: '',
    tipo_unidad: ''
  }
  dependencias = [this.dependencia]
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
    sitio: '',
    state: '',
    anexo: '',
    createdAt: new Date
  }]
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
    sitio: '',
    state: '',
    anexo: '',
    createdAt: new Date
  }]
  dataApro: any = []
  dataNap: any = []
  dataNmd: any = []
  dataCancel: any = []
  idUser: any = ''

  constructor(private reseserver: ReservasAdminService,
    private userService: UserService) {
    this.idUser = this.userService.getuser()
  }


  ngOnInit(): void {
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

        //   // filtra las reservas aprobadas
        //   let tmpApro = this.reservas.filter((reserva) => {
        //     return reserva.state == 'aprobado';
        //   })

        //   // filtra no aprobadas
        //   let tmpNap = this.reservas.filter((reserva) => {
        //     return reserva.state == 'no aprobado';
        //   })

        //   //filtra solicitadas
        //   let tmpNmd = this.reservas.filter((reserva) => {
        //     return reserva.state == 'solicitado';
        //   })

        //   //filtra canceladas
        //   let tmpCancel = this.reservas.filter((reserva) => {
        //     return reserva.state == 'cancelado'
        //   })
        //   //recorre reservas aprobadas y las agrega
        //   tmpApro.forEach((reserva) => {
        //     this.dataApro.push(reserva)
        //   })

        //   //recorre reservas no aprobadas y las agrega
        //   tmpNap.forEach((reserva) => {
        //     this.dataNap.push(reserva)
        //   })

        //   //recorre reservas solicitadas y las agregas
        //   tmpNmd.forEach((reserva) => {
        //     this.dataNmd.push(reserva)
        //   })
        //   //recorre reservas canceladas y las agrega
        //   tmpCancel.forEach((reserva) => {
        //     this.dataCancel.push(reserva)
        //   })
        // }
      // )
          
  }
      )}


    onState($e:any)
      {
        if($e!=''){
          this.reservaux=this.reservas.filter(reserva=>reserva.state==$e)
        }
        else{
          this.reservaux=this.reservas
        }
      }
 
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
  
  removeReserva(id: string) {
    this.reseserver.removeReserva(id).subscribe(
      res => {
        console.log(res)
      }
    );
    location.reload()


  }

  cancelReserva(id: string) {
    Swal
      .fire({
        text: "¿Desea cancelar la reserva?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      })
      .then(resultado => {
        if (resultado.value) {
          this.reseserver.UpdateStateCancel(id)
            .subscribe(
              res => {
                Swal.fire("Reserva Cancelada")
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
