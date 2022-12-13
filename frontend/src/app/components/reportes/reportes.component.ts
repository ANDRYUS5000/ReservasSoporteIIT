import { Component, OnInit } from '@angular/core';
import { ReservasAdminService } from 'src/app/services/reservas-admin.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  reservas=[]

  constructor(private reseserver:ReservasAdminService) { }

  ngOnInit(): void {
    this.reseserver.getReservas()
    .subscribe(
      res=>{
        console.log(res)
        this.reservas=res;
      }
    )
  }

}
