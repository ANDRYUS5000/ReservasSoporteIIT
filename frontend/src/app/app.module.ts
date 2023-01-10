import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//importar modulo de formularios
import { FormsModule } from '@angular/forms'
import { HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
//importando modulo de estadisticas
import { NgChartsModule } from 'ng2-charts';


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

// ---------------------------------

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import  dayGridPlugin  from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import { EstsuperadminComponent } from './components/estsuperadmin/estsuperadmin.component';
import { ReservasDoneUserComponent } from './components/reservas-done-user/reservas-done-user.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  timeGridPlugin,
  dayGridPlugin,
  interactionPlugin
]);

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
    CrearusuariosComponent,
    EstsuperadminComponent,
    ReservasDoneUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FullCalendarModule,
    NgChartsModule
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
