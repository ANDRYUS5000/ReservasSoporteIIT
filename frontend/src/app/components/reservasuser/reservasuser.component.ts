import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IntermediumService } from 'src/app/services/intermedium.service';
import { UserService } from 'src/app/services/user.service';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';

@Component({
  selector: 'app-reservasuser',
  templateUrl: './reservasuser.component.html',
  styleUrls: ['./reservasuser.component.css']
})
export class ReservasuserComponent implements OnInit {

  file=undefined

  reserv={
    fini:'',
    fend:'',   
    namevent:'',
    user:this.ususer.getuser(), 
    depend: '',
    sitio:'Sala de VideoConferencias 1',
    state:'',
    anexo:''
  }

  constructor(public authservice:AuthService,
    public intmserver:IntermediumService,
    public ususer:UserService,
    public reserserv:ReservasAdminService
    ) {}

  ngOnInit(): void {
  }

  async Request(){
    if(this.intmserver.esUser()){
      this.reserv.user=this.ususer.getuser()
      this.reserv.state='solicitado'
      await this.reserserv.solReserva(this.reserv)
    }
  }

}
