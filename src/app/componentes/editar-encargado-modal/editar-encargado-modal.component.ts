import { Component, Input, OnInit } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-encargado-modal',
  templateUrl: './editar-encargado-modal.component.html',
  styleUrls: ['./editar-encargado-modal.component.scss']
})
export class EditarEncargadoModalComponent implements OnInit {
  @Input() id_encargado: any;
  @Input() lista_carreras: any;
  @Input() carrera_actual: any;

  asignacionForm: FormGroup;


  createForm(){
    this.asignacionForm = this.fb.group({
      carrera: ['', [Validators.required]]
    });
  }


  constructor(private admin: AdminService, private fb: FormBuilder,private _snackBar: MatSnackBar) { 
    console.log(this.carrera_actual)
    this.createForm();
  }

  ngOnInit(): void {}

  comparador(){
    for (let i = 0; i < this.lista_carreras.length; i++) {
      if(this.lista_carreras[i].nombre == this.carrera_actual){
        return this.lista_carreras[i].id;
      }
    }
  }

  asignar(){
    console.log(this.carrera_actual)
    let _data: any = {};

    const data = this.asignacionForm.value;

    this.admin.asignarEncargado(this.id_encargado,data.carrera).subscribe({
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
          window.location.reload();
        } else {
          this._snackBar.open("Error al asignar encargado", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      }
    });
  }
}
