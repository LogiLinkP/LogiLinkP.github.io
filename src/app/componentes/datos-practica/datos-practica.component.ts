import { Component, OnInit} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';

@Component({
  selector: 'app-datos-practica',
  templateUrl: './datos-practica.component.html',
  styleUrls: ['./datos-practica.component.css']
})
export class DatosPracticaComponent implements OnInit{
  id: number = 1;
  alumno:any = []
  practica: any = [];
  config_practica: any = [];
  permitir_finalizacion: string = "0";

  link_finalizacion = ""

  constructor(private service: ObtenerDatosService) {
    let respuesta: any = {};

    this.service.obtener_alumno(this.id).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.alumno = respuesta.body;
        this.link_finalizacion = "/alumno/"+this.alumno.id+"/finalizacion/1";
      }
    });
    
    this.service.obtener_practica(this.id).subscribe({
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
                if(this.config_practica.num_informes <= respuesta.body.length){
                  this.permitir_finalizacion = "1";
                }
                
              }   
            });
          }   
        });

        
      }
    });   
  }

  ingresarInforme(){
    let respuesta: any = {};
    let key = (document.getElementById("informe") as HTMLInputElement).value;
    let id_config_informe = 1;
    console.log("Ingresar informe");
    this.service.ingresar_informe(this.practica.id, key, id_config_informe).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.config_practica = respuesta.body;
      }
    });
  }

  ngOnInit() {
  }
}
