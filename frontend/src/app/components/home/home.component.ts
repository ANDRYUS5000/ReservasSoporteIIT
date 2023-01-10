import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  

  //------------------ Para pintar Fechas ------------------------------------//
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
  
  lista: any;
  
  constructor(private reseserver: ReservasAdminService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef) {}
    
  ngOnInit(): void {
    this.authService.getDependencias().subscribe(
      res => {
        
        for (let i of Object.values(res)) {
          this.dependencias.push(i);
        }
      },
      err => console.log(err)
    )
    this.reseserver.getReservas()
    .subscribe(
      async (res) => {
        this.reservas = res;
        this.reservas.sort((a, b) => {
          return Date.parse(a.createdAt.valueOf().toString()) - Date.parse(b.createdAt.valueOf().toString())
        })
        
        this.eventos = this.reservas.map(function (task) {
          return{
            title: task.sitio + '     ' + 'RESERVADO',
            start: task.fini,
            end: task.fend,
            color:'#395144',
            state:task.state,
          }
        }).filter(e=>{
          return e.state==='aprobado'
        })
        const pintarEventos:EventInput[]=this.eventos
        this.calendarOptions.events=pintarEventos
      }
    )
  }


//--------------------------------------------------------------------------//

//---------------------------------------- Calendario ---------------------------------------------//

  eventos=[{ title: '', start: '', end: '', color: '' ,}];
  
  calendarOptions : CalendarOptions = {
    // locale: esLocale,
    allDaySlot: false,

    slotDuration: '00:15',

    headerToolbar: {
      left: 'timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,next today',
    },

    titleFormat: { // will produce something like "Tuesday, September 18, 2018"
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    },

    handleWindowResize:true,
    

    slotMinTime: '7:00:00',
    slotMaxTime: '20:00:00',

    initialView: 'timeGridWeek', // bind is important!

    events:this.eventos,

    slotLabelFormat: {
      
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      meridiem: 'lowercase'
    },

    hiddenDays: [0]

}


}
