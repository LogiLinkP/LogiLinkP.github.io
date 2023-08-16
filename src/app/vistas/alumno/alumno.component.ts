import { Component, OnInit} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss']
})
export class DetalleAlumnoComponent implements OnInit{
  id_estudiante: number = -1;
  id_usuario: number = -1;
  estudiante:any = [];
  practicas: any = [];
  config_practica: any = [];
  nombres_distintos_config_practica: any = [];

  flag: boolean = false;

  link_finalizacion = ""
  link_inscripcion = ""

  constructor(private service: ObtenerDatosService , private route: ActivatedRoute) {
    this.id_usuario = parseInt(this.route.snapshot.paramMap.get('id') || "-1");
  }

  ngOnInit() {
    let respuesta: any = {};

    // Request para obtener al estudiante de acuerdo a su id de usuario
    this.service.obtener_estudiante(this.id_usuario).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.estudiante = respuesta.body;

        // Request para obtener las practicas de acuerdo al id del estudiante
        this.service.obtener_todos_config_practica().subscribe({
          next: (data: any) => {
            respuesta = { ...respuesta, ...data }
          }      ,
          error: (error: any) => console.log(error),
          complete: () => {
            this.config_practica = respuesta.body;
            console.log("Configuraciones de practica:",this.config_practica)
            // Guardar los distintos nombres de las practicas en un arreglo
            this.config_practica.forEach((element: any) => {
              this.nombres_distintos_config_practica.push(element.nombre)
            });
            console.log("Nombres de configuraciones de practica:",this.nombres_distintos_config_practica)

            // Request para obtener todas las practicas de acuerdo al id del estudiante
            this.service.obtener_practica(this.estudiante.id).subscribe({
              next: (data: any) => {
                respuesta = { ...respuesta, ...data }
              },
              error: (error: any) => console.log(error),
              complete: () => {
                this.practicas = respuesta.body;
                console.log("Practicas:",this.practicas)
              }
            });
          }
        });
      }
    });   
  }
}


