import { Component, OnInit } from '@angular/core';
import { AptitudService } from 'src/app/servicios/encargado/aptitud.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rango-modal',
  templateUrl: './rango-modal.component.html',
  styleUrls: ['./rango-modal.component.scss']
})
export class RangoModalComponent implements OnInit {

  editarForm: FormGroup;
  rango: number;
  actual: number;
  user: any = JSON.parse(localStorage.getItem('auth-user') || "{}").userdata;

  createForm() {
    this.editarForm = this.fb.group({
      rango: ['', [Validators.required]],
    });
  }

  constructor(private aptitud: AptitudService, private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit(): void {
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
          this.actual = response.data;
        } else {
          this._snackBar.open("Error al obtener rango", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      }
    })
  }

  actualizar() {
    let data = this.editarForm.value;
    let _data: any = {};
    this.rango = data.rango;
    if(this.rango == 0){
      this.rango = this.actual;
    }
    this.aptitud.actualizarRango(this.user.encargado.id_carrera, this.rango).subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      error: error => {
        this._snackBar.open("Error al actualizar rango", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        if (_data.status == 200) {
          this._snackBar.open("Rango actualizado exitosamente", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
          });
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        } else {
          this._snackBar.open("Error al actualizar rango", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      }
    })
  }
}
