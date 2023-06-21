import { Component, OnInit } from '@angular/core';
import { GetDetallesAlumnoService } from '../../servicios/encargado/resumen_practicas.service';

@Component({
  selector: 'resumen_practicas',
  templateUrl: './resumen_practicas.component.html',
  styleUrls: ['./resumen_practicas.component.css']
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
        console.log(this.alumnos);
      }
    });
  }

  ngOnInit() {
  }
}
