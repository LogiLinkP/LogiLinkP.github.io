import { Component, OnInit } from '@angular/core';
import { GetDetallesAlumnoService } from '../Servicios/get-detalles-alumno.service';



@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  alumnos: any = [];
  alumnos2: any = [];
  dtOptions: DataTables.Settings = {
    language: {
      url: 'assets/localisation/es-es.json'
    }
  };

  constructor(private service: GetDetallesAlumnoService) {
    let respuesta: any = {};
    this.service.full_estudiante_practicas().subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.alumnos = respuesta.body;
      }
    });
  }

  ngOnInit() {
  }
}
