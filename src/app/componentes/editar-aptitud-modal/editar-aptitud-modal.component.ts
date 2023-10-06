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
  @Input() id: any;
  @Input() nombre: any;
  @Input() rango: any;
  @Input() id_carrera: any;

  editarForm: FormGroup;
  nombre_aptitud: string;
  rango_aptitud: number;

  createForm() {
    this.editarForm = this.fb.group({
      nombre: ['', [Validators.required]],
      rango: ['', [Validators.required]]
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
    if(data.nombre == ''){
      this.nombre_aptitud = (document.getElementById("nombre") as HTMLInputElement).value;
    } else{
      this.nombre_aptitud = data.nombre;
    }
    if(data.rango == ''){
      this.rango_aptitud = Number((document.getElementById("rango") as HTMLInputElement).value);
    } else{
      this.rango_aptitud = Number(data.rango);
    }
    this.aptitud.editarAptitud(this.id, this.id_carrera, this.nombre_aptitud, this.rango_aptitud).subscribe({
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
