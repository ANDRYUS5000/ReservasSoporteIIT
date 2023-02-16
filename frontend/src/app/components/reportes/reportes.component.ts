import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import Swal from 'sweetalert2';
import { IntermediumService } from 'src/app/services/intermedium.service';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  p:number=1
  //variable para declarar el modelo de la dependencia
  dependencia={
    _id:'',
    id_unidad:'',
    nombre_unidad:'',
    id_tipo_unidad:'',
    tipo_unidad:''
  }
  //variable para almacenar todas las dependencias existentes
  dependencias=[this.dependencia]
  //variable para declarar el modelo de las reservas a almacenar
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
                  sitio: {
                    name:'',
                    tipo:''
                  },
            state:'', 
            code:'',
            anexo:'',
            createdAt:new Date}]

  //Arreglo de reservas auxiliares
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
            sitio: {
              name:'',
              tipo:''
            },
            state:'',
            code:'',
            anexo:'',
            createdAt:new Date}]

  //Arreglo de codigos
  codigos:any=[]

  //Método constructor para llamar los servicios
  constructor(private reseserver:ReservasAdminService,
              private authService:AuthService,
              private intmService:IntermediumService,
              private router:Router) { }

  //Método que se inicializa al cargar la página
  ngOnInit(): void {
    //solo se carga el contenido si el usuario es Admin o SuperAdmin
    if(!this.intmService.esUser())
    {
      //Se obtienen todas las reservas
    this.reseserver.getReservas()
    .subscribe(
      res=>{
        this.reservas=res;
        //se ordenan las reservas por fecha de creación
        this.reservas.sort((a,b)=>{
          return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
        })
        //se almacenan en la variable auxiliar
        this.reservaux=[...this.reservas]
        //Se obtinen los eventos y se muestran en el calendario
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
        const pintarEventos:EventInput[]=[...this.eventos]
        this.calendarOptions.events=pintarEventos

        this.reservas.forEach(r=>{
          this.codigos.push(r.code)
        })
      }
    )
    //se obtienen las dependencias
    this.authService.getDependencias().subscribe(
      res => {
        //se agrega cada una de las dependencias de la base de datos al arreglo
        for (let i of Object.values(res)) {
          this.dependencias.push(i);
        }
        
      },
      err => console.log(err)
    );
 
    }
    //si el usuario es USER se lanza mensaje de error en permisos y se cierra sesión
    else{
      Swal.fire("No tiene autorización","","error")
        this.authService.logOut()
        this.router.navigate(['/signin'])
     }

   }

   //Método para modificar el estado de una reserva a probado
  resmoda(id:string){
    //Se envía el id de la reserva a actualizar
    this.reseserver.UpdateStateA(id)
    .subscribe(
      res=>{
      this.reservas=res
      this.reservas.sort((a,b)=>{
        return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
      })
      //Se lanza un mensaje para que el Admin notifique al usuario
      Swal.fire("Reserva Aprobada","No se olvide de contactar al usuario y notificar la aprobación","success")
      this.reservaux=[...this.reservas]
      location.reload()
    })
  }
  //Método para modificar el estado de una reserva a solicitado
  resmods(id:string){
    //Se envía el id de la reserva a actualizar
    this.reseserver.UpdateStateS(id)
    .subscribe(
      res=>{
        this.reservas=res
        this.reservas.sort((a,b)=>{
          return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
        })
        //Se lanza un mensaje para que el Admin notifique al usuario
        
        Swal.fire("Reserva Modificada","No se olvide notificar la modificación","success")
        
        this.reservaux=this.reservas
        location.reload()
      })
  }
  //Método para modificar el estado de una reserva a no aprobado
  resmodr(id:string){
    //Se envía el id de la reserva
    this.reseserver.UpdateStateR(id)
    .subscribe(
      res=>{
        this.reservas=res
        this.reservas.sort((a,b)=>{
          return Date.parse(b.createdAt.valueOf().toString()) - Date.parse(a.createdAt.valueOf().toString())
        })
        Swal.fire("Reserva No Aprobada","No se olvide de contactar al usuario y notificar el rechazo","error")
        this.reservaux=this.reservas
        location.reload()
      })
    }
    
    //Método para descargar el documento anexo de cada reserva
  async Down(id:string){
    await (await this.reseserver.Download(id)).subscribe()
  }

  //Método para mostrar las reservas pertenecientes a una facultad específica
  onFacultad($e:any){
    if ($e.target.value!='') {
      this.reservaux=this.reservas.filter(r=>r.user.dependencia[0].nombre_unidad==$e.target.value)
    }else{
      this.reservaux=this.reservas
    }
  }
  
  onCode($e:any){
    if ($e.target.value!='') {
      this.reservaux=this.reservas.filter(r=>{
        let s:string=$e.target.value
        s=s.toUpperCase()
        return r.code.includes( s)
      })
    }else{
      this.reservaux=[...this.reservas]
    }
  }

  //--------------------------------------------------CALENDARIO-----------------------------------------------//

  eventos=[{ title: '', start: '', end: '', color: '' ,}];
  
  calendarOptions: CalendarOptions = {
    allDaySlot:false,
    initialView: 'timeGridDay', // bind is important!
    plugins: [ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ],
    hiddenDays: [0],
    events:this.eventos,

    slotLabelFormat: {
      
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      meridiem: 'short'
    },
    slotMinTime: '7:00:00',
    slotMaxTime: '20:00:00',
    height:'auto',
    headerToolbar: {
      left: 'title',
      center: 'timeGridWeek,timeGridDay,today',
      right: 'prev,next',
    }
  }
  mostrarCal = false

  mostrar(){
    if(this.mostrarCal){
      this.mostrarCal = false
    }else{
      this.mostrarCal = true
    }
  }
}