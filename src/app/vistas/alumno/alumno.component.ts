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

  //HARDCODEADO
  horas = [180,360]

  constructor(private service: ObtenerDatosService) {
    let respuesta: any = {};
    this.service.obtener_uno(this.id).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.alumno = respuesta.body;
      }
    });
  }

  ngOnInit() {
  }
}
