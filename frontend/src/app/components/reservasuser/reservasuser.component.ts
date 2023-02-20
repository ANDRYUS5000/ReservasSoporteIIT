import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { compareAsc , format, parseISO, startOfToday } from "date-fns";
import { AuthService } from 'src/app/services/auth.service';
import { IntermediumService } from 'src/app/services/intermedium.service';
import { UserService } from 'src/app/services/user.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import Swal from 'sweetalert2';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reservasuser',
  templateUrl: './reservasuser.component.html',
  styleUrls: ['./reservasuser.component.css']
})
export class ReservasuserComponent implements OnInit{

// ------------------------------------------------- Date fns ---------------------------------------------------- //

actualhour = format(new Date, 'H')
today = format(startOfToday(), 'yyyy-MM-dd');
start: any;
end: any;
startAux: any;
endAux: any;
convert: any;
convert2: any;
buttonDis = false;
bandera = false;


onHora(e: any){
  this.startAux = e.target.value
  this.buttonDis = false

  if (this.endAux) {
    if(parseInt(this.endAux)<=parseInt(this.startAux)){
      Swal.fire("Hora Inicial Incorrecta","", "warning")
      this.buttonDis = false;
    }else{
      if(this.seleccion === "Auditorio"){
        if((parseInt(this.endAux)-parseInt(this.startAux)<2)){
          Swal.fire("","El auditorio debe reservarse por lo menos 2 horas", "warning")
          this.buttonDis = false;
        }else{
          this.start = this.today+" "+e.target.value;
          this.buttonDis = true;
        }
      }else{
        this.start = this.today+" "+e.target.value;
        this.buttonDis = true;
      }
    }
  }else{
    this.start = this.today+" "+e.target.value;
  }
}

onHora1(e: any){
  this.endAux = e.target.value
  this.buttonDis = false
  
  if (this.startAux) {
    if(parseInt(this.endAux)<=parseInt(this.startAux)){
      Swal.fire("Hora Inicial Incorrecta","", "warning")
      this.buttonDis = false;
    }else{
      if(this.seleccion === "Auditorio"){
        if((parseInt(this.endAux)-parseInt(this.startAux)<2)){
          Swal.fire("","El auditorio debe reservarse por lo menos 2 horas", "warning")
          this.buttonDis = false;
        }else{
          this.end = this.today+" "+e.target.value;
          this.buttonDis = true;
        }
      }else{
        this.end = this.today+" "+e.target.value;
        this.buttonDis = true;
      }
    }
  }else{
    this.end = this.today+" "+e.target.value;
  }
}

// -------------------------------------------------------------------------------------------------------- //


// -------------------------------------------------- Calendar Options ---------------------------------------------- //
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth', // bind is important!
    plugins: [ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ],
    dateClick: this.handleDateClick.bind(this),
    hiddenDays: [0],
    selectable:true
  };

  handleDateClick(arg: any) {
    this.convert = parseISO(arg.dateStr)
    this.convert2 = startOfToday()
    if(compareAsc(this.convert, this.convert2) === 1 || compareAsc(this.convert, this.convert2) === 0 ){
      this.today = arg.dateStr
    }else{ alert("Fecha Incorrecta, No se puede agendar para fechas pasadas")}
    
  };

  // ------------------------------------------------------------------------------------------------------------- //
  
  //------------------------------------------Envio de Reserva---------------------------------------------------- //
  
  //Variable para declarar el modelo de reserva
  reserv={
    fini:'',
    fend:'',   
    namevent:'',
    user:this.ususer.getuser(),
    //se asigna espacio por defecto
    sitio: {
      name:String,
      code:Number
    },
    state:'',
    anexo:'',
    code:''
  }
  
  espaciosaux:any[]=[]
  
  
  seleccion: any  = '0';
  
  espacio={
    name:String,
    code:Number
  }
  tipoespacio= {
    name:String,
    code:Number
  }

  index=-1
  
  espacios = [this.espacio];
  TEsp = [this.tipoespacio]

  ST=['AM','SV','AD','AI','AV']
  
  //variable para almacenar archivo temporal
  filetmp:any
  //variable para verificar si se adjuntó o no un archivo
  FileSelected:boolean=false
  //variable para validar si la extensión del archivo es válida o no
  FileAllowed:boolean=false
    
  //Método para instanciar los servicios
  constructor(public authservice:AuthService,
    public intmserver:IntermediumService,
    public ususer:UserService,
    public reserserv:ReservasAdminService,
    private router:Router
  ) {}
    
  //Método que se ejecuta al cargar la página
  ngOnInit(): void {

    var auxActualHour = parseInt(this.actualhour)
    if(auxActualHour < 6 || auxActualHour > 17){
      Swal.fire("Hora Invalida","Las reservas se pueden realizar de 7am a 6pm", "warning")
      this.buttonDis = false
    }
    
      //solo se muestra el contenido si es usuario es tipo USER
      if(this.intmserver.esUser()){
        //Se declaran variables iniciales
      this.FileSelected=false
      this.authservice.getTEFCode().subscribe(res=>{
        this.TEsp=res
      })
      this.authservice.getEspacios().subscribe(res=>{
        this.espacios=res
        this.espaciosaux=[...this.espacios]
      })
    }
    //si no lo es se lanza una alerta de error y se cierra sesión
    else{
      Swal.fire("No tiene autorización","","error")
      this.authservice.logOut()
      this.router.navigate(['/signin'])
    }
    
  }
  
  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.startAux=undefined
    this.endAux=undefined
    const st:String=this.seleccion
    this.espacio = this.espacios.find(esp=>{
      return esp.name.toString() === st
    })!
    this.index=this.espaciosaux.indexOf(this.espacio)
  };

  Filtrar($e:any){
    this.startAux=undefined
    this.endAux=undefined
    const st:String=$e.target.value
    this.tipoespacio = this.TEsp.find(tip=>{
      return tip.code.toString() === st
    })!
    this.espaciosaux=[...this.espacios]
    const ex=this.espaciosaux.filter(esp=>{
      return esp.code.toString().startsWith(st.substring(0,1))
    })
    this.espaciosaux=ex
    this.seleccion="0"
  }

  //Método para adjuntar anexo
  selectFile($e: any): void {
    //se modifica la variable porque se ha cargado un documento
    this.FileSelected=true
    //arreglo para indicar el archivo selecccionado
    const [file] = $e.target.files
    //arreglo con las extensiones de archivo válidas para evitar la carga de un virus
    let extensiones = ["jpg", "png", "jpeg","docx","odt","xlsx","xls","ods"];
    //se obtiene la extensión del archivo seleccionado 
    var extension=file.name.split(".").slice(-1)
    //Si la extensión del archivo se encuentra en el arreglo de extensiones permitidas
    if(extensiones.indexOf(extension[0])!==-1)
    {
     //se carga el documento en la base de datos
      this.filetmp={
        fileraw:file,      
        filename:file.name
      }
      //se modifica el valor porque el archivo si es permitido
      this.FileAllowed=true
      //Se lanza un mensaje de éxito para el usuario
      Swal.fire("Registro exitoso","Su archivo ha sido adjuntado","success")
      this.buttonDis=true
    }
    //Si el archivo no es válido se lanza un mensaje de error para que 
    //Se cambie el archivo subido
    else{
      Swal.fire("Error","Tipo de archivo no permitido","error")
      this.buttonDis=false
    }    
  }

  //Método para enviar la petición de solicitar una reserva
  async Request(){
    //Solo se ejecuta si el usuario es tipo USER
    if(this.intmserver.esUser()){
      //se envía el sitio seleccionado
      this.reserv.sitio= this.espacio
      //se envía la fecha de inicio
      this.reserv.fini=this.start
      //se envía la fecha de finalización
      this.reserv.fend=this.end
      //se envía el id del usuario
      this.reserv.user=localStorage.getItem('id')
      //se envía el estado solicitado
      this.reserv.state='solicitado'
      //si se adjunta archivo
      if (this.FileSelected) {
        //si el archivo adjunto es válido
        if(this.FileAllowed)
        {
          this.buttonDis=true
          //se envía la petición de registro de nueva reserva a la base de datos
          await (await this.reserserv.solReserva(this.reserv)).subscribe(async(res)=>{
            const body=new FormData()
            body.append('file',this.filetmp.fileraw, this.filetmp.filename);
            body.append('res',res._id);
            (await this.reserserv.saveFile(body)).subscribe()
          })
          //se lanza un mensaje de éxito
          Swal.fire("Reserva solicitada exitosamente","Será notificado por el personal de la oficina de Soporte IIT","success")
        }
        //De lo contrario se lanza un mensaje de error debido al archivo adjunto
        else{
          Swal.fire("Error","No se permite realizar la reserva, verifique el tipo de archivo","error")
        }
      }else{
        //se envía la petición de registro de nueva reserva a la base de datos
        await (await this.reserserv.solReserva(this.reserv)).subscribe()
        //se lanza un mensaje de éxito
        Swal.fire("Reserva solicitada exitosamente","Será notificado por el personal de la oficina de Soporte IIT","success")
      }
    }
  }
}
