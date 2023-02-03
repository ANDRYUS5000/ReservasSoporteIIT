import { NgModule } from '@angular/core';
//se importa el router para establecer las rutas de la barra de navegación
import { RouterModule, Routes } from '@angular/router';
//Se importan los componentes
import { ReservasuserComponent } from './components/reservasuser/reservasuser.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { HomeComponent } from './components/home/home.component'
import { CrearusuariosComponent } from './components/crearusuarios/crearusuarios.component';
import { EstsuperadminComponent } from './components/estsuperadmin/estsuperadmin.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { GestionarespaciosComponent } from './components/gestionarespacios/gestionarespacios.component';
import { ReservasDoneUserComponent } from './components/reservas-done-user/reservas-done-user.component';

//se importa el auth guard
import { AuthGuard } from './auth.guard';
const routes: Routes = [
  //rutas para renderizar los componentes
  {
    path:'reservas',
    component:ReservasuserComponent,
    canActivate:[AuthGuard]//se valida si el usuario tiene iniciada sesión 
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'signin',
    component:SigninComponent
  },
  {
    path:'estsadmin',
    component:EstsuperadminComponent,
    canActivate:[AuthGuard]//se valida si el usuario tiene iniciada sesión 
  },
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'reportes',
    component:ReportesComponent,
    canActivate:[AuthGuard]//se valida si el usuario tiene iniciada sesión 
  },
  {
    path:'registeruser',
    component:CrearusuariosComponent,
    canActivate:[AuthGuard]//se valida si el usuario tiene iniciada sesión 
  },
  {
    path:'createspace',
    component:GestionarespaciosComponent,
    canActivate:[AuthGuard],//se valida si el usuario tiene iniciada sesión 
  },
  {
    path:'misreservas',
    component:ReservasDoneUserComponent,
    canActivate:[AuthGuard]//se valida si el usuario tiene iniciada sesión 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
