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
  config_practica: any = [];
  practicas: any = [];
  //Se deberían mostrar todos los tipos de practica que se pueden realizar - el desafío aquí es
  //que definimos que en la tabla se van a repetir los nombres para cada modalidad de tiempo, por ejemplo
  //por lo que hay que preocuparse de extraer sólo los nombres distintos
  nombres_distintos_config_practica: any = [];
  //Además, va ha haber que hacer una correspondencia entre la práctica que está dando el estudiante y la
  //posición del nombre en el arreglo anterior, por lo que se crea un arreglo de arreglos, que va a tener
  //como primer elemento el nombre de la práctica y como segundo elemento la practica de ese tipo, si es que la está realizando
  practicas_correspondiente_nombre: any = [];

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
              if(!this.nombres_distintos_config_practica.includes(element.nombre)){
                this.nombres_distintos_config_practica.push(element.nombre)
                this.practicas_correspondiente_nombre.push([element.nombre])
              }
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

                // Guardar nombres y practicas en un arreglo
                this.practicas.forEach((element: any) => {
                  // Para cada practica que el alumno tiene, encontrar el nombre de la configuracion de practica en el arreglo
                  // de nombres distintos y agregar la practica en el arreglo que se encarga de mantener la correspondencia entre nombre y practica
                  if(element.config_practica.nombre == this.nombres_distintos_config_practica.find((elemento: any) => elemento == element.config_practica.nombre)){
                    let index = this.nombres_distintos_config_practica.indexOf(element.config_practica.nombre);
                    this.practicas_correspondiente_nombre[index].push(element);                    
                  }
                });                
                console.log("Practicas correspondientes a nombre:",this.practicas_correspondiente_nombre)
              }
            });
          }
        });
      }
    });   
  }
}


