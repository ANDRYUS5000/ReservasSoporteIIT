import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//importar modulo de formularios
import { FormsModule } from '@angular/forms'
import { HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { ReservasuserComponent } from './components/reservasuser/reservasuser.component';
import { ReservasadminComponent } from './components/reservasadmin/reservasadmin.component';

import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HomeComponent } from './components/home/home.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { GestionarespaciosComponent } from './components/gestionarespacios/gestionarespacios.component';
import { CrearusuariosComponent } from './components/crearusuarios/crearusuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    ReservasuserComponent,
    ReservasadminComponent,
    HomeComponent,
    ReportesComponent,
    GestionarespaciosComponent,
    CrearusuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptorService,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
