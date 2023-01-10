import { Component, OnInit } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import * as e from 'cors';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  dependencia={
    _id:'',
    id_unidad:'',
    nombre_unidad:'',
    id_tipo_unidad:'',
    tipo_unidad:''
  }
  dependencias=[this.dependencia]
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
            sitio:'', 
            state:'', 
            anexo:'',
            createdAt:new Date}]
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
            sitio:'', 
            state:'', 
            anexo:'',
            createdAt:new Date}]
  
  constructor(private reseserver:ReservasAdminService,
              private authService:AuthService) { }

  ngOnInit(): void {
    this.reseserver.getReservas()
    .subscribe(
      res=>{
        this.reservas=res;
        this.reservas.sort((a,b)=>{
          return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
        })
        this.reservaux=this.reservas
      }
    )
    this.authService.getDependencias().subscribe(
      res => {
        
        for (let i of Object.values(res)) {
          this.dependencias.push(i);
        }
        
      },
      err => console.log(err)
    );
  }

  resmoda(id:string){
    this.reseserver.UpdateStateA(id)
    .subscribe(
      res=>{
      this.reservas=res
      this.reservas.sort((a,b)=>{
        return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
      })
      Swal.fire("Reserva Aprobada","No se olvide de contactar al usuario y notificar la aprobación","success")
      this.reservaux=this.reservas
    })
  }
  resmods(id:string){
    this.reseserver.UpdateStateS(id)
    .subscribe(
      res=>{
      this.reservas=res
      this.reservas.sort((a,b)=>{
        return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
      })
      alert("No se olvide notificar la modificacion")
      this.reservaux=this.reservas
    })
  }
  resmodr(id:string){
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

  async Down(id:string){
    await (await this.reseserver.Download(id)).subscribe()
  }

  onFacultad($e:any){
    if ($e.target.value!='') {
      this.reservaux=this.reservas.filter(r=>r.user.dependencia[0].nombre_unidad==$e.target.value)
    }else{
      this.reservaux=this.reservas
    }
  }
  
}

