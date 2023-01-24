import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventInput, EventSourceInput } from '@fullcalendar/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {FormControl} from '@angular/forms'
import {lastValueFrom, Observable} from 'rxjs'
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { ArrayType } from '@angular/compiler';

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
    sitio: {
      name:'',
      tipo:''
    },
    state: '',
    anexo: '',
    createdAt: new Date
  }]
  
  constructor(private reseserver: ReservasAdminService,
    private authService: AuthService) {
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(value => {return this._filter(value || '')}),
      );
    }
    
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
          return Date.parse(
            a.createdAt.valueOf().toString()) - Date.parse(b.createdAt.valueOf().toString()
            )
        })
        
        this.eventos = this.reservas.map(function (task) {
          return{
            title: task.sitio.name,
            start: task.fini,
            end: task.fend,
            color:'#2E88E9',
            type: task.sitio.tipo,
            state:task.state,
          }
        }).filter(e=>{
          return e.state==='aprobado'
        })
        this.eventox=[...this.eventos]
        const pintarEventos:EventInput[]=[...this.eventox]
        this.calendarOptions.events=pintarEventos
      }
    )
  }


//--------------------------------------------------------------------------//

//---------------------------------------- Calendario ---------------------------------------------//

  eventos=[{ title: '', start: '', end: '', color: '' , type:'', state:''}];
  eventox:EventInput[]=[{ title: '', start: '', end: '', color: '' ,type:'', state:''}];
  
  calendarOptions : CalendarOptions = {

    plugins: [ dayGridPlugin, timeGridPlugin, listPlugin ],

    slotDuration: '00:15',
    
    handleWindowResize:true,

    headerToolbar: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,next today',
    },

    titleFormat: { // will produce something like "Tuesday, September 18, 2018"
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    },

    slotMinTime: '7:00:00',
    slotMaxTime: '20:00:00',

    initialView: 'timeGridWeek', // bind is important!

    events:this.eventos,

    allDaySlot:false,

    slotLabelFormat: {
      
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      meridiem: 'lowercase'
    },

    hiddenDays: [0],

    contentHeight:350,
  }

  // --------------------------------------------FILTER-------------------------------------------------- //
  myControl = new FormControl('');
  options:string[] = []
  filteredOptions: Observable<string[]>

  private _filter(value: string): Observable<any[]> {
    return this.authService.getData()
    .pipe(
      map(response => response.filter((option:string) => {
        return option.toLowerCase().indexOf(value.toLowerCase()) === 0
      }))
    )
  }

  filter($e:any){
    while (this.eventox.length>0) {
      this.eventox.pop()
    }
    this.eventos.forEach(ev=>{
      if ($e.option.value == ev.type) {
        this.eventox.push(ev)
      }
    })
    this.calendarOptions.events=[...this.eventox]
    //   const body={name:ev.title} //EL POST FUNCIONA CON OBJECTS 
  }

  wea($e:any){
    if ($e.target.value==='') {
      this.eventox=[...this.eventos]
      this.calendarOptions.events=[...this.eventox]
    }
  }
}
