import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-registro-encargado',
  templateUrl: './registro-encargado.component.html',
  styleUrls: ['./registro-encargado.component.scss']
})
export class RegistroEncargadoComponent implements OnInit{
  registroForm: FormGroup;
  nombre: string = "";
  apellido: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  es_supervisor: boolean = false;
  es_estudiante: boolean = false;
  es_encargado: boolean = false;
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
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  register() {
    const data = this.registroForm.value;
    this.nombre = this.nombre + " " + this.apellido;
    let _data: any = {}
    this.usuario.register(
      data.email, data.password,
      data.confirmPassword, data.nombre,
      true, this.es_supervisor,
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
}
