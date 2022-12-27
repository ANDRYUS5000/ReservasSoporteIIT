import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { ReservasadminComponent } from './components/reservasadmin/reservasadmin.component';
import { ReservasuserComponent } from './components/reservasuser/reservasuser.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { HomeComponent } from './components/home/home.component'
import { CrearusuariosComponent } from './components/crearusuarios/crearusuarios.component';

import { AuthGuard } from './auth.guard';
import { ReportesComponent } from './components/reportes/reportes.component';
import { GestionarespaciosComponent } from './components/gestionarespacios/gestionarespacios.component';
const routes: Routes = [
  //rutas para renderizar los componentes
  {
    path:'reservas',
    component:ReservasuserComponent,
    canActivate:[AuthGuard]
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
    path:'admin',
    component:ReservasadminComponent,
    canActivate:[AuthGuard]
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
    canActivate:[AuthGuard]
  },
  {
    path:'registeruser',
    component:CrearusuariosComponent,
    canActivate:[AuthGuard]

  },
  {
    path:'createspace',
    component:GestionarespaciosComponent,
    canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
