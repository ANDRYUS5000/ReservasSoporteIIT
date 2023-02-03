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
  //variable para declarar el modelo de dependencia
  dependencia = {
    _id: '',
    id_unidad: '',
    nombre_unidad: '',
    id_tipo_unidad: '',
    tipo_unidad: ''
  }
  //variable para declarar el arreglo de las dependencias
  dependencias = [this.dependencia]
  //variable para almacenar las reservas consultadas desde Mongodb
  reservas = [
    {
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
    }
  ]
  //Método constructor, se crean las instancias de los servicios
  constructor(private reseserver: ReservasAdminService,
    private authService: AuthService) {
      //al momento de inicializar la página se asume que no hay espacio seleccionado 
      //por lo cual no se pintan las reservas en el calendario
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(value => {return this._filter(value || '')}),
      );
    }
  //Método que se ejecuta al cargar la página
  ngOnInit(): void {
    //Se obtienen las dependencias almacenadas en la base de datos
    this.authService.getDependencias().subscribe(
      res => {
        
        for (let i of Object.values(res)) {
          this.dependencias.push(i);
        }
      },
      err => console.log(err)
    )
    //Se obtienen todas las reservas realizadas
    this.reseserver.getReservas()
    .subscribe(
      async (res) => {
        this.reservas = res;
        this.reservas.sort((a, b) => {
          //se retorna el arreglo de reservas ordenado por fecha
          return Date.parse(
            a.createdAt.valueOf().toString()) - Date.parse(b.createdAt.valueOf().toString()
            )
        })
        //arreglo de eventos que se pintan en el calendario, solo se aceptan aquellos con estado aprobado
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
  //variable para declarar el modelo del evento a almacenar para pintar en el calendario
  eventos=[{ title: '', start: '', end: '', color: '' , type:'', state:''}];
  //variable definitiva para enviar el tipo de dato correcto a ser pintado
   eventox:EventInput[]=[{ title: '', start: '', end: '', color: '' ,type:'', state:''}];
  
   //variable para definir las opciones del calendario
  calendarOptions : CalendarOptions = {
  //se indica que debe mostrar por día, indicando la hora en forma de lista
  plugins: [ dayGridPlugin, timeGridPlugin, listPlugin ],
  //se debe actualizar la hora cada 15 segundos para que no hayan retrasos en la carga de reservas
  slotDuration: '00:15',
  //debe ser reponsive  
  handleWindowResize:true,
  //se habilitan las opciones para pasar al día anterior o siguiente
  headerToolbar: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,next today',
    },
    //Formato del título
    titleFormat: { // will produce something like "Tuesday, September 18, 2018"
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    },
    //La hora inicial para indicar las reservas es 7 a.m
    slotMinTime: '7:00:00',
    //la hora final para indicar las reservas es 8 p.m
    slotMaxTime: '20:00:00',
    //Es importante para mostrar la semana
    initialView: 'timeGridWeek', // bind is important!
    //son los eventos a cargar en el calendario
    events:this.eventos,

    allDaySlot:false,
    //opciones para configurar el formato de las horas
    slotLabelFormat: {
      
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      meridiem: 'lowercase'
    },
    //Se excluye el día domingo porque no es relevante
    hiddenDays: [0],
    //se define el alto de la ventana en pixeles
    contentHeight:350,
  }

  // --------------------------------------------FILTER-------------------------------------------------- //
  //se establece la variable para filtrar por tipo de espacio físico
  myControl = new FormControl('');
  //variable para declarar las opciones permitidas
  options:string[] = []
  //variable para manejar una promesa con las reservas correspondientes a un sitio en específico
  filteredOptions: Observable<string[]>

  //Método para filtrar las reservas por el tipo de espacio físico seleccionado
  private _filter(value: string): Observable<any[]> {
    return this.authService.getData()
    .pipe(
      map(response => response.filter((option:any) => {
        return option.toLowerCase().indexOf(value.toLowerCase()) === 0
      })
      )
    )
  } 
  //Método para obtener el último elemento de las reservas y verificar si su tipo de espacio coincide con el seleccionado por el usuario
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
    
  }
  //Se verifica que efectivamente haya un filtro para poder cargar los elementos
  verify($e:any){
    if ($e.target.value==='') {
      this.eventox=[...this.eventos]
      this.calendarOptions.events=[...this.eventox]
    }
  }
}
