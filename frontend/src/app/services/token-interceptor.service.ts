import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private authService:AuthService
  ) { }
  //método para enviar el token por el header y permitir el inicio de sesión
   intercept(req: HttpRequest<any>, next: HttpHandler) {
    const tokenizeReq=req.clone({
      setHeaders:{
        Authorization:`Bearer ${this.authService.getToken()}`
      }
    })
    return next.handle(tokenizeReq);
  }
}
