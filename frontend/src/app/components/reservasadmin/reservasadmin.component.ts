import { Component, OnInit } from '@angular/core';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';

@Component({
  selector: 'app-reservasadmin',
  templateUrl: './reservasadmin.component.html',
  styleUrls: ['./reservasadmin.component.css']
})
export class ReservasadminComponent implements OnInit {
  reservas=[]

  constructor(private reservasAdminService:ReservasAdminService) { }

  ngOnInit(): void {
    this.reservasAdminService.getReservas()
    .subscribe(
      res=>{
        this.reservas=res;
      }
    )
  }

}
