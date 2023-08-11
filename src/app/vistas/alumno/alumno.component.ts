import { Component, OnInit} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss']
})
export class DetalleAlumnoComponent implements OnInit{
  id_alumno: number = -1;
  alumno:any = []
  practica: any = [];
  flag: boolean = false;

  link_finalizacion = ""
  link_inscripcion = ""

  constructor(private service: ObtenerDatosService , private router: ActivatedRoute) {
    this.router.params.subscribe(params => {this.id_alumno = +params['id'];});
  }

  ngOnInit() {
    let respuesta: any = {};

    this.service.obtener_alumno(this.id_alumno).subscribe({
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
    
    this.service.obtener_practica(this.id_alumno).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.practica = respuesta.body;
      }
    });
  }
}
