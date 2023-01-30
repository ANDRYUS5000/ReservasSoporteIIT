import { Component, OnInit } from '@angular/core';
import { ChartData, ChartDataset, ChartType } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import { IntermediumService } from 'src/app/services/intermedium.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

import 'ng2-charts'

@Component({
  selector: 'app-estsuperadmin',
  templateUrl: './estsuperadmin.component.html',
  styleUrls: ['./estsuperadmin.component.css']
})
export class EstsuperadminComponent implements OnInit {
//variable para desplegar el menú para indicar las estadísticas por semestre, el año siguiente debe ser agregado manualmente  
  semestres=[{valor:1,name:'Semestre A 2023'},
              {valor:2,name:'Semestre B 2023'}]


//método para instanciar los servicios y el enrutador
  constructor(private reseserver: ReservasAdminService,
    private authService: AuthService,
    private router:Router,
    public intmService:IntermediumService, ){ }
 
//variable para definir las etiquetas del eje y al mostrar las estadísticas
lineChartLabels: any[] = ['Ene','Feb','Mar','Abr','May','Jun',
                            'Jul','Ago','Sep','Oct','Nov','Dic']
//se activa la opción para que el diagrama sea responsive(se adapte a la pantalla)
lineChartOptions = { responsive: true }
//se define el array para enviar los datos a graficar
  lineChartData:ChartDataset[]=[]
//se activa la opción para indicar los valores en cada barra
  lineChartLegend = true;

  lineChartPlugins = [];
  //se define que el gráfico sea en forma de barras
  lineChartType: ChartType = 'bar';

  //se define la variable de dependencia necesaria para traer las reservas
   dependencia = {
    _id: '',
    id_unidad: '',
    nombre_unidad: '',
    id_tipo_unidad: '',
    tipo_unidad: ''
  }
  //se define una variable que almacena como objeto inicial la dependencia vacía
   dependencias = [this.dependencia]

   //se inicializan contadores auxiliares
  contAp = 0;
  contNAp = 0;
  contNMd = 0;
  contCl = 0;


  //variables para almacenar los contadores de reservas aprobadas, no aprobadas, solicitadas y canceladas
  dataApro: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataNap:any[]= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataNmd:any[]=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataCl:any[]=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  //variables auxiliares
  dataAproX: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataNapX:any[]= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataNmdX:any[]=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataCancelX:any[]=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  
  //variable inicial para realizar la selección del menú
  seleccion=0;

  //variable para declarar el arreglo de reservas
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

  //Método para conocer la selección del menú para indicar el semestre
  onSemestre(e: any) {
    
    this.seleccion=e.target.value;
    if(this.seleccion==0)
    {
      this.dataAproX=this.dataApro
      this.dataNmdX=this.dataNmd
      this.dataNapX=this.dataNap
      this.dataCancelX=this.dataCl
      this.lineChartLabels=['Ene','Feb','Mar','Abr','May','Jun',
      'Jul','Ago','Sep','Oct','Nov','Dic']
    }
    else if(this.seleccion==1)
    {
      this.dataAproX=this.dataApro.slice(0,6)
      this.dataNmdX=this.dataNmd.slice(0,6)
      this.dataNapX=this.dataNap.slice(0,6)
      this.dataCancelX=this.dataCl.slice(0,6)
      this.lineChartLabels=['Ene','Feb','Mar','Abr','May','Jun']
    }
    else if(this.seleccion==2)
    {
      this.dataAproX=this.dataApro.slice(6)
      this.dataNmdX=this.dataNmd.slice(6)
      this.dataNapX=this.dataNap.slice(6)
      this.dataCancelX=this.dataCl.slice(6)
      this.lineChartLabels=['Jul','Ago','Sep','Oct','Nov','Dic']
    }
    this.lineChartData = [
      {
        data: this.dataAproX, label: 'Aprobadas',backgroundColor:'#4aee7b'
      },
      { data: this.dataNmdX, label: 'Sin Modificar',backgroundColor: '#0000ff'},
      {
        data: this.dataNapX, label: 'No aprobadas',backgroundColor:'#ee4a4a'
      },
      {
        data: this.dataCancelX, label: 'Canceladas',backgroundColor:'#F4D03F'
      }
    ]
  }; 
//método que se ejecuta apenas se inicializa la pestaña
  ngOnInit(): void {
    //solo se permite visualizar los datos si el rol del usuario es SuperAdmin
   
   if(this.intmService.esSuperAdmin())
   {
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
         //filtra canceladas
         let tmpCancel = this.reservas.filter((reserva) => {
          return reserva.state == 'cancelado';
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
        //recorre reservas canceladas e incrementa contador en mes correspondiente
        tmpCancel.forEach((reserva) => {
          mes = (new Date(reserva.createdAt).getMonth()).valueOf()
          // crear array de canceladas
          this.dataCl[mes] += 1
        })

        this.dataAproX=this.dataApro
        this.dataNapX=this.dataNap
        this.dataNmdX=this.dataNmd
        this.dataCancelX=this.dataCl
        this.lineChartData = [
          {
            data: this.dataAproX, label: 'Aprobadas',backgroundColor:'#4aee7b'
          },
          { data: this.dataNmdX, label: 'Sin Modificar',backgroundColor: '#0000ff'},
          {
            data: this.dataNapX, label: 'No aprobadas',backgroundColor:'#ee4a4a'
          },
          {
            data: this.dataCancelX, label: 'Canceladas',backgroundColor:'#F4D03F'
          }
        ]
      }
    )
   }
   //de lo contrario se lanza un mensaje, se cierra sesión y se redirige a la pestaña de ingreso
   else{
    Swal.fire("No tiene autorización","","error")
      this.authService.logOut()
      this.router.navigate(['/signin'])
   }
  }
}
 