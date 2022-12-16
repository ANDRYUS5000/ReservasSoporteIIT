import { Component, OnInit } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';

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
            anexo:''}]
  

  constructor(private reseserver:ReservasAdminService) { }

  ngOnInit(): void {
    this.reseserver.getReservas()
    .subscribe(
      res=>{
        this.reservas=res;
        console.log(this.reservas);
      }
    )
  }

  resmoda(id:string){
    this.reseserver.UpdateStateA(id)
    .subscribe(
      res=>{
      this.reservas=res
    })
  }
  resmods(id:string){
    this.reseserver.UpdateStateS(id)
    .subscribe(
      res=>{
      this.reservas=res
    })
  }
  resmodr(id:string){
    this.reseserver.UpdateStateR(id)
    .subscribe(
      res=>{
      this.reservas=res
    })
  }

  async Down(id:string){
    await (await this.reseserver.Download(id)).subscribe(res=>{
      
    })
  }
}
