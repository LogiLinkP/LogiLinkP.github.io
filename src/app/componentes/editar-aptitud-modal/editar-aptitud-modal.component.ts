import { Component, Input, OnInit } from '@angular/core';
import { AptitudService } from 'src/app/servicios/encargado/aptitud.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  selector: 'app-editar-aptitud-modal',
  templateUrl: './editar-aptitud-modal.component.html',
  styleUrls: ['./editar-aptitud-modal.component.scss']
})
export class EditarAptitudModalComponent implements OnInit{
  @Input() id: number;
  @Input() n_aptitud: string;
  @Input() id_carrera: number;

  editarForm: FormGroup;
  nombre_aptitud: string;

  createForm() {
    this.editarForm = this.fb.group({
      n_aptitud: ['', [Validators.required]],
    });
  }

  constructor(private aptitud: AptitudService, private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit(): void {
      
  }

  editar(){
    let data = this.editarForm.value;
    let _data: any = {};
    this.nombre_aptitud = data.nombre;
    if(this.nombre_aptitud == ""){
      this.nombre_aptitud = this.n_aptitud;
    }
    this.aptitud.editarAptitud(this.id, this.id_carrera, this.nombre_aptitud).subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      error: error => {
        this._snackBar.open("Error al editar aptitud", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        if (_data.status == 200) {
          this._snackBar.open("Aptitud editada exitosamente", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
          });
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        } else {
          this._snackBar.open("Error al editar aptitud", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      }
    });
  }
}
