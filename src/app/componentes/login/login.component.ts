import { Component,OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { StorageUserService } from 'src/app/servicios/usuario/storage-user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  email: string;
  password: string;

  rol: string[] = [];

  constructor(public usuario: UsuarioService, private storage: StorageUserService){}

  ngOnInit(): void {
      if(this.storage.isLoggedIn()){
        this.rol = this.storage.getUser().roles;
      }
  }

  login(){
    const user = { email: this.email, password: this.password };
    this.usuario.login(this.email,this.password).subscribe( {
      next: data => {
        this.usuario.setToken(data.token);
        this.storage.saveUser(data);
        this.rol = this.storage.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        console.log("Error de inicio de sesion");
      }
  });
  }

  reloadPage(): void{
    window.location.reload()
  }
}
