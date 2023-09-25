import { Component } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  asignacionForm: FormGroup;
  encargado: any;
  carrera: any;
  encargados: any = [];
  carreras: any = [];
  pares: any = [];
  flag: boolean = false;
  id_encargado: any;
  carrera_actual: any;
  id_carrera: any;
  nombre_carrera: any;
  correos_admitidos: any;
  

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
          this.carreras.push({nombre: _data.body[i].nombre, id: _data.body[i].id, correo: _data.body[i].correos_admitidos});
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
        this.encargados = _data.body.data;
        console.log(this.encargados)
      }
    });
    this.createForm();
  }

  editar(id: any, carrera_actual: any){
    this.id_encargado = id;
    this.carrera_actual = carrera_actual;
  }

  editar_carrera(id: any, nombre: any, correos_admitidos: any){
    this.id_carrera = id;
    this.nombre_carrera = nombre;
    this.correos_admitidos = correos_admitidos;
  }

  eliminar(id: any, id_carrera: any){
    let _data: any = {};
    this.admin.getEncargadoCarrera(id_carrera).subscribe({
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
        console.log(_data.body)
        if(_data.body.encargados.length == 1){
          let decision = confirm("Si elimina a este encargado no habrá encargados en esta carrera, favor, asignar un encargado a esa carrera")
          if(decision){
            this.admin.eliminarEncargado(id).subscribe({
              next: data => {
                _data = { ..._data, ...data }
              },
              error: error => {
                this._snackBar.open("Error al eliminar encargado", "Cerrar", {
                  panelClass: ['red-snackbar'],
                  duration: 2000
                });
              },
              complete: () => {
                if (_data.status == 200) {
                  this._snackBar.open("Encargado eliminado exitosamente, redirigiendo...", "Cerrar", {
                    panelClass: ['green-snackbar'],
                    duration: 2000
                  });
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000);
                } else {
                  this._snackBar.open("Error al eliminar encargado", "Cerrar", {
                    panelClass: ['red-snackbar'],
                    duration: 2000
                  });
                }
              }
            });  
          }
        }
        else{
          this.admin.eliminarEncargado(id).subscribe({
            next: data => {
              _data = { ..._data, ...data }
            },
            error: error => {
              this._snackBar.open("Error al eliminar encargado", "Cerrar", {
                panelClass: ['red-snackbar'],
                duration: 2000
              });
            },
            complete: () => {
              if (_data.status == 200) {
                this._snackBar.open("Encargado eliminado exitosamente, redirigiendo...", "Cerrar", {
                  panelClass: ['green-snackbar'],
                  duration: 2000
                });
                setTimeout(function () {
                  window.location.reload();
                }, 2000);
              } else {
                this._snackBar.open("Error al eliminar encargado", "Cerrar", {
                  panelClass: ['red-snackbar'],
                  duration: 2000
                });
              }
            }
          });
        }
      }
    });
    
  }

  eliminar_carrera(id: any){
    let _data: any = {};
    this.admin.eliminarCarrera(id).subscribe({
      next: data => {
        _data = { ..._data, ...data }
      },
      error: error => {
        this._snackBar.open("Error al eliminar carrera", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 2000
        });
      },
      complete: () => {
        if (_data.status == 200) {
          this._snackBar.open("Carrera eliminada exitosamente, redirigiendo...", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
          });
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        } else {
          this._snackBar.open("Error al eliminar carrera", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 2000
          });
        }
      }
    })
  }


  //encargado(){
  //  this.router.navigate(['/admin/crear-encargado']);
  //}
//
  //carrera(){
  //  this.router.navigate(['/admin/crear-carrera']);
  //}
//
  //asignacion(){
  //  this.router.navigate(['/admin/asignacion']);
  //}
//
  //eliminar(){
  //  this.router.navigate(['/admin/eliminar-encargado']);
  //}
}
