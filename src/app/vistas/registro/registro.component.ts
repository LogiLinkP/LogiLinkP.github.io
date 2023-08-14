import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  es_supervisor: boolean;
  es_estudiante: boolean;
  RUT: string;
  extras = {};

  constructor(public usuario: UsuarioService, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required],
      es_supervisor: [false],
      es_estudiante: [false],
      RUT: []
      //crear validador custom para RUT real
    });
  }

  ngOnInit(): void {
  }

  register() {
    if (this.es_estudiante) {
      this.extras = {RUT: this.RUT};
    }
    if (this.es_supervisor) {
      this.extras = {};
    }
    const data = this.registroForm.value;
    const user = {correo: data.email, password: data.password, cnfPwd: data.confirmPassword, nombre: data.nombre, es_encargado: false, es_supervisor: data.es_supervisor, es_estudiante: data.es_estudiante, es_admin: false, extras: data.extras};
    console.log(user);
    this.usuario.register(data.email,data.password,data.confirmPassword,data.nombre,false,data.es_supervisor,data.es_estudiante,false,data.extras).subscribe( {next: data => { user }, error: err => { console.log('Error de registro') } });
  }

  checkout(arg: any) {
    if (arg.target.value == "1") {
      this.es_estudiante = true;
      this.es_supervisor = false;
    }
    else if (arg.target.value = "2") {
      this.es_supervisor = true;
      this.es_estudiante = false;
    } else {
      this.es_estudiante = false;
      this.es_supervisor = false;
    }
  }
}
