import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-encargado',
  templateUrl: './crear-encargado.component.html',
  styleUrls: ['./crear-encargado.component.scss']
})
export class CrearEncargadoComponent implements OnInit{
  encargadoForm: FormGroup;
  email: string;

  createForm(){
    this.encargadoForm = this.fb.group({
      email: ['', [Validators.required]]
    });
  }

  constructor(public admin: AdminService, private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
  }

  crear(){
    const data = this.encargadoForm.value;
    this.email = data.email;
    let _data: any = {}
    this.admin.crearCarrera(this.email).subscribe({
      next: data => {
        _data = { ..._data, ...data }
    },
      complete: () => {
        if (_data.status == 200) {
          window.location.reload();
          this._snackBar.open("Se le ha enviado un link al encargado para que pueda registrarse", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
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

  volver(){
    this.router.navigate(['/admin']);
  }
}
