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
    const user = { nombre: this.nombre, tipo: 1, email: this.email, pwd: this.password};
    this.usuario.register(this.nombre,this.email,this.password,this.confirmPassword,1).subscribe( {next: data => { this.usuario.setToken(data.token) }, error: err => { console.log('Error de registro') } });
  }
}
