import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasAdminService {
  //se define la URL para tener acceso al backend
  private URL='http://localhost:3000/api/reservas'

  //se define la instancia para gestionar las peticiones HTTP
  constructor(private http:HttpClient,
    private ususer:UserService,
    private ch:HttpHandler) { }

  //se define la ruta para obtener todas las reservas
  getReservas(){
    return this.http.get<any>(this.URL+'/report')
  }
  //se define la ruta para realizar la solicitud de una reserva, aquí se envía la reserva
  async solReserva(res:any){
    return await this.http.post<any>(this.URL+'/solicitar',res)
  }
  //se define la ruta para adjuntar el anexo de una reserva, aquí se envía el archivo
  async saveFile(body:FormData){
    return this.http.post<any>(this.URL+'/upload',body)
  }
  //se define la ruta para adjuntar el anexo de una reserva, aquí se envía el archivo
  async Download(id:string){
    return this.http.get<any>(this.URL+'/files/'+id)
  }
  //se define la ruta para modificar el estado de una reserva a aprobado
   UpdateStateA(id:string){
    return this.http.get<any>(this.URL+'/resmoda/'+id)
  }
  //se define la ruta para modificar el estado de una reserva a solicitado
  UpdateStateS(id:string){
    return this.http.get<any>(this.URL+'/resmods/'+id)
  }
  //se define la ruta para modificar el estado de una reserva a no aprobado
  UpdateStateR(id:string){
    return this.http.get<any>(this.URL+'/resmodr/'+id)
  }
  //se define la ruta para modificar el estado de una reserva a cancelado
  UpdateStateCancel(id:string){
    return this.http.get<any>(this.URL+'/resmodc/'+id)
  }
  //se define la ruta para obtener las reservas de un usuario
  GetReservasUser(id:string){
    return this.http.get<any>(this.URL+'/resuser/'+id)
  }
  //se define la ruta para eliminar una reserva, solo sirve para reservas solicitadas o no aprobadas
  removeReserva(id:string)
  {
    return this.http.delete<any>(this.URL+'/removeres/'+id)
  }
}
