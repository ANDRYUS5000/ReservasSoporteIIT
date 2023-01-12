import { Component, OnInit } from '@angular/core';
import { ChartData, ChartDataset } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';


import 'ng2-charts'
import { Chart } from 'chart.js/dist';

@Component({
  selector: 'app-estsuperadmin',
  templateUrl: './estsuperadmin.component.html',
  styleUrls: ['./estsuperadmin.component.css']
})
export class EstsuperadminComponent implements OnInit {

  semestres=[{valor:1,name:'Semestre A 2023'},
              {valor:2,name:'Semestre B 2023'}]

  contAprob = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  contNoMod = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  contNoApro = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  constructor(private reseserver: ReservasAdminService,
    private authService: AuthService) { }
 

  lineChartLabels: any[] = ['Ene','Feb','Mar','Abr','May','Jun',
                            'Jul','Ago','Sep','Oct','Nov','Dic']

  lineChartOptions = { responsive: true }

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  dependencia = {
    _id: '',
    id_unidad: '',
    nombre_unidad: '',
    id_tipo_unidad: '',
    tipo_unidad: ''
  }
  dependencias = [this.dependencia]

  contAp = 0;
  contNAp = 0;
  contNMd = 0;


  dataApro: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataNap:any[]= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataNmd:any[]=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  
  seleccion=1;

  
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

  onSemestre(e: any) {
    this.seleccion=e.target.value; }; 

  ngOnInit(): void {
    this.authService.getDependencias().subscribe(
      res => {

        for (let i of Object.values(res)) {
          this.dependencias.push(i);
        }
      },
      err => console.log(err)
    )

    let mes = 0;
    this.reseserver.getReservas()
      .subscribe(
        (res) => {
          this.reservas = res;
          this.reservas.sort((a, b) => {
            return Date.parse(a.createdAt.valueOf().toString()) - Date.parse(b.createdAt.valueOf().toString())
          })
          // filtra las reservas aprobadas
          let tmpApro = this.reservas.filter((reserva) => {
            return reserva.state == 'aprobado';
          })

          // filtra no aprobadas
          let tmpNap = this.reservas.filter((reserva) => {
            return reserva.state == 'no aprobado';
          })

          //filtra solicitadas
          let tmpNmd = this.reservas.filter((reserva) => {
            return reserva.state == 'solicitado';
          })

          //recorre reservas aprobadas e incrementa contador en mes correspondiente
          tmpApro.forEach((reserva) => {
            mes = (new Date(reserva.createdAt).getMonth()).valueOf()
            this.dataApro[mes] += 1
          })

          //recorre reservas no aprobadas e incrementa contador en mes correspondiente
          tmpNap.forEach((reserva) => {
            mes = (new Date(reserva.createdAt).getMonth()).valueOf()
            // crear array de no aprobadas
            this.dataNap[mes] += 1
          })

          //recorre reservas solicitadas e incrementa contador en mes correspondiente
          tmpNmd.forEach((reserva) => {
            mes = (new Date(reserva.createdAt).getMonth()).valueOf()
            // crear array de solicitadas
            this.dataNmd[mes] += 1
          })

        })

   
        if(this.seleccion==1)
        {
          this.dataApro=this.dataApro.slice(0,6)
          this.dataNmd=this.dataNmd.slice(0,6)
          this.dataNap=this.dataNap.slice(0,6)
          this.lineChartLabels=['Ene','Feb','Mar','Abr','May','Jun']
          
        }
        else if(this.seleccion==2)
        {
          this.dataApro=this.dataApro.slice(6)
          this.dataNmd=this.dataNmd.slice(6)
          this.dataNap=this.dataNap.slice(6)
          this.lineChartLabels=['Jul','Ago','Sep','Oct','Nov','Dic']
          console.log('semestre b',this.lineChartLabels)
        }
        

  }

 
  
  lineChartData: ChartDataset[] = [
  {

    data:this.dataApro, label: 'Aprobadas',backgroundColor:'#4aee7b'
  },
  { data: this.dataNmd, label: 'Sin Modificar',backgroundColor: '#0000ff'},
  {
    data: this.dataNap, label: 'No aprobadas',backgroundColor:'#ee4a4a'
  }]
  
  
}
 