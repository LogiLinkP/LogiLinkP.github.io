import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { StorageUserService } from 'src/app/servicios/usuario/storage-user.service';
import { Router } from "@angular/router";

import { environment } from '../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  email: string;
  password: string;
  dataUsuario: any;

  constructor(public usuario: UsuarioService, private storage: StorageUserService, private router: Router, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    let response: any = {};
    const data = this.loginForm.value;
    console.log(data.email, data.password);
    this.usuario.login(data.email, data.password).subscribe( {
      next: data => {
        response = {...response,...data}
      },
      error: err => {
        console.log(err)
        console.log("Error de inicio de sesion");
      },
      complete: () => {
          console.log(response.body.userdata)
          const {message,userdata,token} = response.body;
          this.dataUsuario = response.body.userdata
          this.storage.saveUser(response.body) //¿response.body.userdata?
          if (this.dataUsuario.es_encargado) {
            this.router.navigate(["/"+environment.ruta_practicas])
          } else if (this.dataUsuario.es_estudiante) {
            this.router.navigate(["/"+environment.ruta_alumno+"/"+this.dataUsuario.id])
          } else if (this.dataUsuario.es_supervisor) {
            this.router.navigate(["/home_supervisor"])
          } else if (this.dataUsuario.es_admin) {
            this.router.navigate(["/admin"])
          } else {
            console.log("Usuario no tiene tipo definido")
          }
      }
  });
  }
}
