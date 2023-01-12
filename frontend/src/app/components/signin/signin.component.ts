import { Component, OnInit } from '@angular/core';
// import { AuthService } from 'src/app/services/auth.service';
import { IntermediumService } from 'src/app/services/intermedium.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  
  user={email:'',
        password:''}
  mensaje='';
  bandera=false;
  tipo_user='';
  dependencia='';
  constructor(
    // private authService:AuthService,
    private intmService:IntermediumService,
    private router:Router,
    private authservice:AuthService) { }

  ngOnInit(): void {
  }

  login(){
    this.intmService.login(this.user);
    
 
      try {
        setTimeout(()=>{
          this.authservice.logOut()
        }
          
          , 108000);
        
      } catch (error) {
        console.log(error)
      }
    }
     
    
  }

