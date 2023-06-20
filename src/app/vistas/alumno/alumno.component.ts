import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDetallesAlumnoService } from '../../servicios/encargado/resumen_practicas.service';

@Component({
  selector: 'alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class DetalleAlumnoComponent {
  id: number = 0;
  private sub: any;
  alumno:any = []

  constructor(private service1: GetDetallesAlumnoService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'] - 1; // (+) converts string 'id' to a number
    });
  }
}
