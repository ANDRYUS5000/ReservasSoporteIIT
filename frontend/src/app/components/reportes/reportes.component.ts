import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import { DateRangePickerComponent } from 'ngx-daterange';
import { IDateRangePickerOptions } from 'ngx-daterange/interfaces/IDateRangePickerOptions'
import { IDateRange } from 'ngx-daterange/interfaces/IDateRange'
import * as moment from 'moment'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
              private authService:AuthService) {}

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
      alert("No se olvide de contactar al usuario y notificar la aprobación")
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
      alert("No se olvide de contactar al usuario y notificar el rechazo")
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

  onState($e:any){
    if ($e!='') {
      this.reservaux=this.reservas.filter(r=>r.state==$e)
    }else{
      this.reservaux=this.reservas
    }
  }

  firstFieldOptions: IDateRangePickerOptions = {
    labelText:'Filtrar por Fecha',
    autoApply: false,
    clickOutsideAllowed:false,
    format: 'YYYY/MM/DD',
    icons: 'default',
    minDate: moment("2022-12"),
    maxDate: moment().add(1, 'years'),
    position:"right",
    preDefinedRanges: [
      {
        name: "Esté mes",
        value: {
          start: moment().startOf('month'),
          end: moment().endOf('month')
        }
      },
      {
        name: "Está semana",
        value: {
          start: moment().startOf('week'),
          end: moment().endOf('week')
        }
      }
    ],
    validators: Validators.required,
  }
}

