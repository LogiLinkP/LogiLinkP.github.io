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
  es_supervisor: boolean = false;
  es_estudiante: boolean = false;
  RUT: string;
  extras = {};

  constructor(public usuario: UsuarioService) {}

  ngOnInit(): void {
  }

  register() {
    if(this.es_estudiante){
      this.extras = {RUT: this.RUT};
    }
    if(this.es_supervisor){
      this.extras = {};
    }
    const user = {correo: this.email, password: this.password, cnfPwd: this.confirmPassword, nombre: this.nombre, es_encargado: false, es_supervisor: this.es_supervisor, es_estudiante: this.es_estudiante, es_admin: false, extras: this.extras};
    this.usuario.register(this.email,this.password,this.confirmPassword,this.nombre,false,this.es_supervisor,this.es_estudiante,false,this.extras).subscribe( {next: data => { user }, error: err => { console.log('Error de registro') } });
  }

  checkout(arg: any){
    if(arg.target.value == "1"){
      this.es_estudiante = true;
      this.es_supervisor = false;
    }
    else if(arg.target.value = "2"){
      this.es_supervisor = true;
      this.es_estudiante = false;
    }else{
      this.es_estudiante = false;
      this.es_supervisor = false;
      this.reloadPage();
    }
  }

  reloadPage(): void{
    window.location.reload()
  }
}
