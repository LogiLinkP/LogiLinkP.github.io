import { Component, OnInit } from '@angular/core';
import { GetDetallesAlumnoService } from '../Servicios/get-detalles-alumno.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent {
  
  alumnos:any = []

  constructor( private service: GetDetallesAlumnoService){
  }

  ngOnInit(){
    this.alumnos = this.service.get_alumnos();
  }
}
