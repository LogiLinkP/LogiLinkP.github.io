import { Component,OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { StorageUserService } from 'src/app/servicios/usuario/storage-user.service';
import { Router } from "@angular/router";
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  email: string;
  password: string;

  constructor(public usuario: UsuarioService, private storage: StorageUserService){}

  ngOnInit(): void {
  }

  login(){
    let response: any = {};
    const user = { email: this.email, password: this.password };
    this.usuario.login(this.email,this.password).subscribe( {
      next: data => {
        response = {...response,...data}
      },
      error: err => {
        console.log("Error de inicio de sesion");
      },
      complete: () => {
        if(response.body != null){
          this.reloadPage();
        }
      }
        
  });
  }

  reloadPage(): void{
    window.location.reload()
  }
}
