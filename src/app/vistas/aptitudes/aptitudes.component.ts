import { Component } from '@angular/core';
import { AptitudService } from 'src/app/servicios/encargado/aptitud.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aptitudes',
  templateUrl: './aptitudes.component.html',
  styleUrls: ['./aptitudes.component.scss']
})
export class AptitudesComponent {

  aptitudes: any = [];
  user: any = JSON.parse(localStorage.getItem('auth-user') || "{}").userdata;
  nombre: string;
  rango: number;
  id: number;
  id_carrera: number;

  constructor(private aptitud: AptitudService, private _snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) { 
    let _data: any = {};
    this.aptitud.getAptitudes(this.user.encargado.id_carrera).subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      error: error => {
        this._snackBar.open("Error al obtener aptitudes", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        this.aptitudes = _data.body.data;
      }
    });
  }

  editar(id: number, nombre: string, rango: number, id_carrera: number){
    this.id = id;
    this.nombre = nombre;
    this.rango = rango;
    this.id_carrera = id_carrera;
  }

  eliminar(id: number){
    let _data: any = {};
    this.aptitud.eliminarAptitud(id).subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      error: error => {
        this._snackBar.open("Error al eliminar aptitud", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        if (_data.status == 200) {
          this._snackBar.open("Aptitud eliminada exitosamente", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
          });
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        } else {
          this._snackBar.open("Error al eliminar aptitud", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      }
    });
  }

}
