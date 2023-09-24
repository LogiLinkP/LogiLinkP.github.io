import { Component } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.scss']
})
export class AsignacionComponent {

  asignacionForm: FormGroup;
  encargado: any;
  carrera: any;
  encargados: any = [];
  carreras: any = [];
  pares: any = [];
  flag: boolean = false;

  createForm(){
    this.asignacionForm = this.fb.group({
      encargado: ['', [Validators.required]],
      carrera: ['', [Validators.required]]
    });
  }

  constructor(private admin: AdminService, private _snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) { 
    let _data: any = {};
    this.admin.getCarrera().subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      error: error => {
        this._snackBar.open("Error al obtener carreras", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        for (let i = 0; i < _data.body.length; i++) {
          this.carreras.push({nombre: _data.body[i].nombre, id: _data.body[i].id});
        }
        console.log(this.carreras)  
      }
    });
    this.admin.getEncargado().subscribe({
      next: data => {
        _data = { ..._data, ...data }
        console.log(_data)
      },
      error: error => {
        this._snackBar.open("Error al obtener encargados", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        for (let i = 0; i < _data.body.data.length; i++) {
          console.log(_data.body.data[i].id)
          this.encargados.push({nombre: _data.body.data[i].nombre, id_carrera: _data.body.data[i].id_carrera, id: _data.body.data[i].id, correo: _data.body.data[i].correo, id_usuario: _data.body.data[i].id_usuario});
        }
      }
    });
    this.createForm();
  }

  

  asignar(){
    let _data: any = {};

    const data = this.asignacionForm.value;

    this.encargado = data.encargado;
    this.carrera = data.carrera;
    console.log(data.encargado, data.carrera);
    let json = {id_encargado: data.encargado, id_carrera: this.carrera};
    this.pares.push(json);
    console.log(this.pares);
    this.admin.asignarEncargado(this.pares).subscribe({
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

  mostrar(arg: any){
    if(arg.target.value == ""){
      this.flag = false;
    }
    else{
      this.flag = true;
    }
  }
  
}