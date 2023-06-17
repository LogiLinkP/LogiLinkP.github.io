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
  }

  ngOnInit() {

    this.alumnos = this.service.get_alumnos();
    this.alumnos2 = this.service.get_alumnos2().subscribe(data => {
      console.log(data);
    }
    );
  }
}
