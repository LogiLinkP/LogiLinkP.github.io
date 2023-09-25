import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-encargado-modal',
  templateUrl: './crear-encargado-modal.component.html',
  styleUrls: ['./crear-encargado-modal.component.scss']
})
export class CrearEncargadoModalComponent {
  encargadoForm: FormGroup;
  email: string;

  createForm(){
    this.encargadoForm = this.fb.group({
      email: ['', [Validators.required]]
    });
  }

  constructor(public admin: AdminService, private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router) { this.createForm(); }

  ngOnInit() {
  }

  crear(){
    const data = this.encargadoForm.value;
    this.email = data.email;
    let _data: any = {}
    this.admin.crearEncargado(this.email).subscribe({
      next: data => {
        _data = { ..._data, ...data }
    },
      complete: () => {
        if (_data.status == 200) {
          this._snackBar.open("Se le ha enviado un link al encargado para que pueda registrarse", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 3000
          });
        } else {
          this._snackBar.open("Error al registrar encargado", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      },
      error: error => {
        this._snackBar.open("Error al registrar encargado", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      }
    
    });
    this._snackBar.open("Se le ha enviado un link al encargado para que pueda registrarse", "Cerrar", {
      panelClass: ['green-snackbar'],
      duration: 2000
    });
  }
}
