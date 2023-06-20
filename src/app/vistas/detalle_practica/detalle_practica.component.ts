import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDetallesAlumnoService } from '../../servicios/encargado/resumen_practicas.service';


@Component({
  selector: 'detalle_practica',
  templateUrl: './detalle_practica.component.html',
  styleUrls: ['./detalle_practica.component.css']
})
export class DetalleEncargadoComponent {
  id: number = 0;
  private sub: any;
  alumno:any = []

  constructor(private service: GetDetallesAlumnoService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'] - 1; // (+) converts string 'id' to a number
    });
  }
}
