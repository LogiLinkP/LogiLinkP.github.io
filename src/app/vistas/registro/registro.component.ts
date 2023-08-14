import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit{
  nombre: string = "";
  inicial: string = "";
  apellido: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  es_supervisor: boolean = false;
  es_estudiante: boolean = false;
  es_encargado: boolean = false;
  RUT: string = "";
  extras = {};

  constructor(public usuario: UsuarioService) {}

  ngOnInit(): void {
  }

  register() {
    this.nombre = this.inicial + " " + this.apellido;
    if(this.es_estudiante){
      this.extras = {RUT: this.RUT};
    }
    if(this.es_supervisor){
      this.extras = {};
    }
    if(this.es_encargado){
      this.extras = {};
    }
    const user = {correo: this.email, password: this.password, cnfPwd: this.confirmPassword, nombre: this.nombre, es_encargado: this.es_encargado, es_supervisor: this.es_supervisor, es_estudiante: this.es_estudiante, es_admin: false, extras: this.extras};
    this.usuario.register(this.email,this.password,this.confirmPassword,this.nombre,false,this.es_supervisor,this.es_estudiante,false,this.extras).subscribe( {next: data => { user }, error: err => { console.log('Error de registro') } });
  }

  checkout(arg: any){
    if(arg.target.value == "1"){
      this.es_estudiante = true;
      this.es_supervisor = false;
      this.es_encargado = false;
    }
    else if(arg.target.value = "2"){
      this.es_supervisor = true;
      this.es_estudiante = false;
      this.es_encargado = false;
    }else if(arg.target.value == "3"){
      this.es_estudiante = false;
      this.es_supervisor = false;
      this.es_encargado = true;
    }else{
      this.es_estudiante = false;
      this.es_supervisor = false;
      this.es_encargado = false;
    }
  }
}
