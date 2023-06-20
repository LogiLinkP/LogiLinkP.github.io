import { Component, OnInit} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';

@Component({
  selector: 'alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class DetalleAlumnoComponent implements OnInit{
  id: number = 1;
  alumno:any = []
  practica: any = [];

  //HARDCODEADO
  link_finalizacion = ""
  link_inscripcion = ""

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
        this.link_inscripcion = "/alumno/"+this.alumno.id+"/iniciarpractica/1"; 
      }
    });
    
    this.service.obtener_practica(this.id).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.practica = respuesta.body;
      }
    });
  }

  ngOnInit() {
  }
}
