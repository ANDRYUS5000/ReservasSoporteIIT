import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//importar modulo de formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
//importando modulo de estadisticas
import { NgChartsModule } from 'ng2-charts';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { ReservasuserComponent } from './components/reservasuser/reservasuser.component';

import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HomeComponent } from './components/home/home.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { GestionarespaciosComponent } from './components/gestionarespacios/gestionarespacios.component';
import { CrearusuariosComponent } from './components/crearusuarios/crearusuarios.component';

// ---------------------------------

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { FullCalendarModule } from '@fullcalendar/angular';
import { EstsuperadminComponent } from './components/estsuperadmin/estsuperadmin.component';
import { ReservasDoneUserComponent } from './components/reservas-done-user/reservas-done-user.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatButtonModule} from '@angular/material/button';
import { FooterComponent } from './footer/footer.component'
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    ReservasuserComponent,
    HomeComponent,
    ReportesComponent,
    GestionarespaciosComponent,
    CrearusuariosComponent,
    EstsuperadminComponent,
    ReservasDoneUserComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule,
    NgChartsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxPaginationModule,
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
