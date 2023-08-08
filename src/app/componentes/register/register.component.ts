import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;

  constructor(public usuario: UsuarioService) {}

  ngOnInit(): void {
  }

  register() {
    const user = {correo: this.email, password: this.password, nombre: this.nombre, es_encargado: false, es_supervisor: false, es_estudiante: true, es_admin: false};
    this.usuario.register(this.email,this.password,this.nombre,false,false,true,false).subscribe( {next: data => { this.usuario.setToken(data.token) }, error: err => { console.log('Error de registro') } });
  }
}
