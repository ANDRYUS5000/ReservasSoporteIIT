import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { IntermediumService } from './services/intermedium.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  esAdmin=false;
  constructor(public authService:AuthService,public intmService:IntermediumService){
  }
}
