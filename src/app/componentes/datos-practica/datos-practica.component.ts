import { Component, OnInit} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import {ActivatedRoute} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-datos-practica',
  templateUrl: './datos-practica.component.html',
  styleUrls: ['./datos-practica.component.scss']
})

export class DatosPracticaComponent implements OnInit{
  id_estudiante: number = -1;
  estudiante:any = []
  practica: any = [];
  config_practica: any = [];
  permitir_finalizacion: boolean = true;

  link_finalizacion = ""

  constructor(private service: ObtenerDatosService, private router: ActivatedRoute, private _snackBar: MatSnackBar) {
    this.router.params.subscribe(params => {this.id_estudiante = +params['id'];});
  }

  

  ngOnInit() {
    let respuesta: any = {};
    this.service.obtener_estudiante(this.id_estudiante).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.estudiante = respuesta.body;
        this.link_finalizacion = "/alumno/"+this.estudiante.id+"/finalizacion/1";
      }
    });
    
    this.service.obtener_practica(this.id_estudiante).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.practica = respuesta.body;

        this.service.obtener_config_practica(this.practica.id_config_practica).subscribe({
          next: (data: any) => {
            respuesta = { ...respuesta, ...data }
          },
          error: (error: any) => console.log(error),
          complete: () => {
            this.config_practica = respuesta.body;

            this.service.obtener_informes(this.practica.id).subscribe({
              next: (data: any) => {
                respuesta = { ...respuesta, ...data }
              },
              error: (error: any) => console.log(error),
              complete: () => {
                console.log("largo respuesta:",respuesta.body.length);
                console.log("num_informes:",this.config_practica.num_informes);
                console.log("horas_config_practica:",this.config_practica.cantidad_horas);
                console.log("horas_practica:",this.practica.horas);
                if(this.config_practica.num_informes <= respuesta.body.length && this.config_practica.cantidad_horas <= this.practica.horas){
                  this.permitir_finalizacion = false;
                }
                
              }   
            });
          }   
        });

        
      }
    });   
  }
}
