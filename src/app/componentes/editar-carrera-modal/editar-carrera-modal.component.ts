import { Component, Input, OnInit } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  selector: 'app-editar-carrera-modal',
  templateUrl: './editar-carrera-modal.component.html',
  styleUrls: ['./editar-carrera-modal.component.scss']
})
export class EditarCarreraModalComponent implements OnInit {
  @Input() id_carrera: any;
  @Input() nombre_carrera: any;
  @Input() correos_admitidos: any;

  editarForm: FormGroup;
  nombre: string;
  correos: string;

  createForm(){
    this.editarForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo_admitido: ['', [Validators.required]]
    });
  }


  constructor(private admin: AdminService, private fb: FormBuilder,private _snackBar: MatSnackBar) { 
    this.createForm();
  }

  ngOnInit(): void {}

  editar(){
    let data = this.editarForm.value;
    this.nombre = data.nombre;
    console.log(this.nombre)
    this.correos = data.correo_admitido;
    let _data: any = {};
    this.admin.editarCarrera(this.id_carrera,this.nombre,this.correos).subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      error: error => {
        this._snackBar.open("Error al editar carrera", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        if (_data.status == 200) {
          this._snackBar.open("Carrera editada exitosamente", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
          });
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        } else {
          this._snackBar.open("Error al editar carrera", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      }
    });
  }

}
