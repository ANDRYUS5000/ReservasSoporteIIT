import { Component, OnInit } from '@angular/core';
import { ChartData, ChartDataset, ChartType } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';


import 'ng2-charts'

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
  lineChartData:ChartDataset[]=[]

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = 'bar';

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
  dataAproX: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataNapX:any[]= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataNmdX:any[]=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  
  seleccion=0;

  
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
    
    this.seleccion=e.target.value;
    if(this.seleccion==0)
    {
      this.dataAproX=this.dataApro
      this.dataNmdX=this.dataNmd
      this.dataNapX=this.dataNap
      this.lineChartLabels=['Ene','Feb','Mar','Abr','May','Jun',
      'Jul','Ago','Sep','Oct','Nov','Dic']
    }
    else if(this.seleccion==1)
    {
      this.dataAproX=this.dataApro.slice(0,6)
      this.dataNmdX=this.dataNmd.slice(0,6)
      this.dataNapX=this.dataNap.slice(0,6)
      this.lineChartLabels=['Ene','Feb','Mar','Abr','May','Jun']
    }
    else if(this.seleccion==2)
    {
      this.dataAproX=this.dataApro.slice(6)
      this.dataNmdX=this.dataNmd.slice(6)
      this.dataNapX=this.dataNap.slice(6)
      this.lineChartLabels=['Jul','Ago','Sep','Oct','Nov','Dic']
    }
    this.lineChartData = [
      {
        data: this.dataAproX, label: 'Aprobadas',backgroundColor:'#4aee7b'
      },
      { data: this.dataNmdX, label: 'Sin Modificar',backgroundColor: '#0000ff'},
      {
        data: this.dataNapX, label: 'No aprobadas',backgroundColor:'#ee4a4a'
      }
    ]
  }; 

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

        this.dataAproX=this.dataApro
        this.dataNapX=this.dataNap
        this.dataNmdX=this.dataNmd

        this.lineChartData = [
          {
            data: this.dataAproX, label: 'Aprobadas',backgroundColor:'#4aee7b'
          },
          { data: this.dataNmdX, label: 'Sin Modificar',backgroundColor: '#0000ff'},
          {
            data: this.dataNapX, label: 'No aprobadas',backgroundColor:'#ee4a4a'
          }
        ]
      }
    )
  }
}
 