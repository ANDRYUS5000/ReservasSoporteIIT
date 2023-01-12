import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasAdminService {
  private URL='http://localhost:3000/api/reservas'

  constructor(private http:HttpClient,
    private ususer:UserService,
    private ch:HttpHandler) { }

  getReservas(){
    return this.http.get<any>(this.URL+'/report')
  }

  async solReserva(res:any){
    return await this.http.post<any>(this.URL+'/solicitar',res)
  }

  async saveFile(body:FormData){
    return this.http.post<any>(this.URL+'/upload',body)
  }

  async Download(id:string){
    return this.http.get<any>(this.URL+'/files/'+id)
  }

  UpdateStateA(id:string){
    return this.http.get<any>(this.URL+'/resmoda/'+id)
  }
  UpdateStateS(id:string){
    return this.http.get<any>(this.URL+'/resmods/'+id)
  }
  UpdateStateR(id:string){
    return this.http.get<any>(this.URL+'/resmodr/'+id)
  }

  UpdateStateCancel(id:string){
    return this.http.get<any>(this.URL+'/resmodc/'+id)
  }
  GetReservasUser(id:string){
    return this.http.get<any>(this.URL+'/resuser/'+id)
  }

  removeReserva(id:string)
  {
    return this.http.delete<any>(this.URL+'/removeres/'+id)
  }
  
}
