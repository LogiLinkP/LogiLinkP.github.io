import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  nombre: string = "";
  apellido: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  es_supervisor: boolean = false;
  es_estudiante: boolean = false;
  es_encargado: boolean = false;
  RUT: string = "";
  extras = {};
  checkEs = true;

  constructor(public usuario: UsuarioService, private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router) {
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
      RUT: ['']
      //crear validador custom para RUT real
    });
  }

  ngOnInit(): void {
  }

  register() {
    if (!this.es_encargado && !this.es_estudiante && !this.es_supervisor) {
      this._snackBar.open("Debe seleccionar un tipo de usuario", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 2000
      });
      return;
    }
    const data = this.registroForm.value;
    this.RUT = data.RUT
    this.nombre = this.nombre + " " + this.apellido;
    if (this.es_estudiante) {
      this.extras = { RUT: this.RUT };
    }
    if (this.es_supervisor) {
      this.extras = {};
    }
    if (this.es_encargado) {
      this.extras = {};
    }
    let _data: any = {}
    this.usuario.register(
      data.email, data.password,
      data.confirmPassword, data.nombre,
      false, this.es_supervisor,
      this.es_estudiante, false,
      this.extras
    ).subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      complete: () => {
        if (_data.status == 200) {
          this.router.navigate(["/" + environment.ruta_login])
          this._snackBar.open("Usuario creado correctamente", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
          });
        } else {
          this._snackBar.open("Error al crear usuario", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      },
      error: err => {
        this._snackBar.open("Error al crear usuario", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      }
    });
  }

  checkout(arg: any) {
    if (arg.target.value == "1") {
      this.checkEs = false;
      this.es_estudiante = true;
      this.es_supervisor = false;
      this.es_encargado = false;
    } else if (arg.target.value = "2") {
      this.checkEs = false;
      this.es_supervisor = true;
      this.es_estudiante = false;
      this.es_encargado = false;
    } else if (arg.target.value == "3") {
      this.checkEs = false;
      this.es_estudiante = false;
      this.es_supervisor = false;
      this.es_encargado = true;
    } else {
      this.checkEs = true;
      this.es_estudiante = false;
      this.es_supervisor = false;
      this.es_encargado = false;
      console.log(4)
    }
  }
}
