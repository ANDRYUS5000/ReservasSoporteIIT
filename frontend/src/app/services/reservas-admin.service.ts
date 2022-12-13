import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasAdminService {
  private URL='http://localhost:3000/api/reservas'

  constructor(private http:HttpClient,
    private ususer:UserService) { }

  getReservas(){
    return this.http.get<any>(this.URL+'/report')
  }

  async solReserva(res:any){
    await this.http.post<any>(this.URL+'/solicitar',res).subscribe()
  }

}
