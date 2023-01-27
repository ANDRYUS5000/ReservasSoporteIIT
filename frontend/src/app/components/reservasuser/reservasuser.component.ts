import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { compareAsc, compareDesc, format, parse, parseISO, startOfToday } from "date-fns";
import { AuthService } from 'src/app/services/auth.service';
import { IntermediumService } from 'src/app/services/intermedium.service';
import { UserService } from 'src/app/services/user.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import Swal from 'sweetalert2';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-reservasuser',
  templateUrl: './reservasuser.component.html',
  styleUrls: ['./reservasuser.component.css']
})
export class ReservasuserComponent implements OnInit{

// ------------------------------------------------- Date fns ---------------------------------------------------- //

// llegaInicio = document.getElementById("from").value;


today = format(startOfToday(), 'yyyy-MM-dd');
start: any;
end: any;
convert: any;
convert2: any;

onHora(e: any){
  this.start = this.today+" "+e.target.value
}

onHora1(e: any){
  this.end = this.today+" "+e.target.value
}

name = document.getElementById("nombre")

// -------------------------------------------------------------------------------------------------------- //


// -------------------------------------------------- Calendar Options ---------------------------------------------- //
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // bind is important!
    plugins: [ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ],
    dateClick: this.handleDateClick.bind(this),
    hiddenDays: [0]
  };

  handleDateClick(arg: any) {
    this.convert = parseISO(arg.dateStr)
    this.convert2 = startOfToday()
    if(compareAsc(this.convert, this.convert2) === 1 || compareAsc(this.convert, this.convert2) === 0 ){
      this.today = arg.dateStr
    }else{ alert("Fecha Incorrecta, No se puede agendar para fechas pasadas")}
    
  };

  espacios: any = [
    {name: "Auditorio", value: 1},{name: "Sala de VideoConferencias 1", value: 2}, {name: "Sala de VideoConferencias 2", value: 3}
  ];
 

  opcionSeleccionado: any  = '0';
  verSeleccion: any        = '';

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;
  };

// ------------------------------------------------------------------------------------------------------------- //

//------------------------------------------Envio de Reserva---------------------------------------------------- //

  reserv={
    fini:'',
    fend:'',   
    namevent:'',
    user:this.ususer.getuser(),
    sitio:'Sala de VideoConferencias 1',
    state:'',
    anexo:''
  }

  filetmp:any
  FileSelected:boolean=false
  FileAllowed:boolean=false

  constructor(public authservice:AuthService,
    public intmserver:IntermediumService,
    public ususer:UserService,
    public reserserv:ReservasAdminService
  ) {}

  ngOnInit(): void {
    this.FileSelected=false
  }

  selectFile($e: any): void {
    this.FileSelected=true
    const [file] = $e.target.files
    let extensiones = ["jpg", "png", "jpeg","docx","odt","xlsx","xls","ods"];
    var extension=file.name.split(".").slice(-1)
    console.log(extension)
    if(extensiones.indexOf(extension[0])!==-1)
    {
      console.log("si está")
      this.filetmp={
        fileraw:file,      
        filename:file.name
      }
      this.FileAllowed=true
      Swal.fire("Registro exitoso","Su archivo ha sido adjuntado","success")
       
    }
    else{
      Swal.fire("Error","Tipo de archivo no permitido","error")
    }    
  }

  async Request(){
    if(this.intmserver.esUser()){
      this.reserv.sitio= this.opcionSeleccionado
      this.reserv.fini=this.start
      this.reserv.fend=this.end
      this.reserv.user=localStorage.getItem('id')
      this.reserv.state='solicitado'
      if(this.FileAllowed)
      {
        await (await this.reserserv.solReserva(this.reserv)).subscribe(async(res)=>{
          if (this.FileSelected) {
            const body=new FormData()
            body.append('file',this.filetmp.fileraw, this.filetmp.filename);
            body.append('res',res._id);
            (await this.reserserv.saveFile(body)).subscribe()
          }
        })
        Swal.fire("Reserva solicitada exitosamente","Será notificado por el personal de la oficina de Soporte IIT","success")
      }
      else{
        Swal.fire("Error","No se permite realizar la reserva, verifique el tipo de archivo","error")
      }
    }
  }
}
