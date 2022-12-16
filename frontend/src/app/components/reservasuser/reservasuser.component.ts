import { Component, OnInit, Type } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IntermediumService } from 'src/app/services/intermedium.service';
import { UserService } from 'src/app/services/user.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reservasuser',
  templateUrl: './reservasuser.component.html',
  styleUrls: ['./reservasuser.component.css']
})
export class ReservasuserComponent implements OnInit {

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
    if (this.FileSelected) {
      console.log("seleccionado");
    }
    const [file] = $e.target.files
    this.filetmp={
      fileraw:file,
      filename:file.name
    }
  }

  async Request(){
    if(this.intmserver.esUser()){
      this.reserv.user=this.ususer.getuser()
      this.reserv.state='solicitado'
      await (await this.reserserv.solReserva(this.reserv)).subscribe(async(res)=>{
        console.log(res);
        if (this.FileSelected) {
          const body=new FormData()
          body.append('file',this.filetmp.fileraw, this.filetmp.filename);
          body.append('res',res._id);
          (await this.reserserv.saveFile(body)).subscribe(res=>console.log(res))
        }else{
          console.log("sin file");
        }
      })
    }
  }
}
