import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetallePracticaService } from 'src/app/servicios/encargado/detalle-practica.service';

@Component({
  selector: 'app-detalle-practica',
  templateUrl: './detalle-practica.component.html',
  styleUrls: ['./detalle-practica.component.css']
})
export class DetallePracticaComponent {

  practica: any = {};
  estudiante: any = {};
  config_practica: any = {};

  constructor(private service: DetallePracticaService, private _snackBar: MatSnackBar) {
    let respuesta: any = {};
    
    //====REQUEST para obtener la practica====//
    // Cambiar este 1 para que sea el id del estudiante guardada en la sesion
    this.service.obtener_practica(1).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        this.practica = [];
        this._snackBar.open("Error al solicitar datos de práctica", "Cerrar", {
          duration: 10000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        this.practica = respuesta.body;
        //====REQUEST para obtener el estudiante====//
        this.service.obtener_estudiante(this.practica.id_estudiante).subscribe({
          next: (data: any) => {
            respuesta = { ...respuesta, ...data }
          },
          error: (error: any) => {
            this.estudiante = [];
            this._snackBar.open("Error al solicitar datos de estudiante", "Cerrar", {
              duration: 10000,
              panelClass: ['red-snackbar']
            });
          },
          complete: () => {
            this.estudiante = respuesta.body;
          }
        });
        //fin request para obtener el estudiante
        
        //====REQUEST para obtener la configuracion de la practica====
        this.service.obtener_config_practica(this.practica.id_config_practica).subscribe({
          next: (data: any) => {
            respuesta = { ...respuesta, ...data }
          },
          error: (error: any) => {
            this.config_practica = [];
            this._snackBar.open("Error al solicitar datos de configuración de práctica", "Cerrar", {
              duration: 10000,
              panelClass: ['red-snackbar']
            });
          },
          complete: () => {
            this.config_practica = respuesta.body;
          }
        });
        // fin request para obtener la configuracion de la practica
      }
    });
    // fin request para obtener la practica
  }

  ngOnInit() {
  }
}
