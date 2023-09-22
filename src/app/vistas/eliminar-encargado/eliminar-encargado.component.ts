import { Component } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-eliminar-encargado',
  templateUrl: './eliminar-encargado.component.html',
  styleUrls: ['./eliminar-encargado.component.scss']
})
export class EliminarEncargadoComponent {

  eliminarForm: FormGroup;
  id: any;
  encargados: any = [];

  createForm(){
    this.eliminarForm = this.fb.group({
      id: ['', [Validators.required]],
    });
  }

  constructor(private admin: AdminService, private _snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) { 
    let _data: any = {};
    this.admin.getEncargado().subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      error: error => {
        this._snackBar.open("Error al obtener encargados", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        for (let i = 0; i < _data.body.data.length; i++) {
          this.encargados.push({nombre: _data.body.data[i].nombre, id_carrera: _data.body.data[i].id_carrera, id: _data.body.data[i].id, correo: _data.body.data[i].correo, id_usuario: _data.body.data[i].id_usuario});
        }
      }
    });
    this.createForm();
  }

  

  eliminar(){
    let _data: any = {};
    const data = this.eliminarForm.value;
    this.id = data.id;
    console.log(this.id)
    this.admin.eliminarEncargado(this.id).subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      error: error => {
        this._snackBar.open("Error al asignar encargado", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        if (_data.status == 200) {
          this._snackBar.open("Encargado asignado exitosamente", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
          });
        } else {
          this._snackBar.open("Error al asignar encargado", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      }
    });
  }

  volver(){
    this.router.navigate(['/admin']);
  }
}
