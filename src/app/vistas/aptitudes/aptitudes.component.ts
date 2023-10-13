import { Component, OnInit } from '@angular/core';
import { AptitudService } from 'src/app/servicios/encargado/aptitud.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aptitudes',
  templateUrl: './aptitudes.component.html',
  styleUrls: ['./aptitudes.component.scss']
})
export class AptitudesComponent implements OnInit{

  aptitudes: any = [];
  user: any = JSON.parse(localStorage.getItem('auth-user') || "{}").userdata;
  n_aptitud: string;
  rango: number;
  id: number;
  id_carrera: number;
  flag: boolean = false;

  constructor(private aptitud: AptitudService, private _snackBar: MatSnackBar, private router: Router) { 
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
    let response: any = {};
    this.aptitud.getRango(this.user.encargado.id_carrera).subscribe({
      next: data => {
        response = { ...response, ...data }
      },
      error: error => {
        this._snackBar.open("Error al obtener rango", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        if (response.status == 200) {
          this.rango = response.body.data;
          if (this.rango == 0) {
            this.flag = true;
          }
        } else {
          this._snackBar.open("Error al obtener rango", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      }
    });
  }

  ngOnInit(): void {
    
  }

  editar(id: number, n_aptitud: string, id_carrera: number){
    this.id = id;
    this.n_aptitud = n_aptitud;
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
