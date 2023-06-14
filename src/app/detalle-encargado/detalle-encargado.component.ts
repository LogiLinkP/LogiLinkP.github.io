import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDetallesAlumnoService } from '../Servicios/get-detalles-alumno.service';


@Component({
  selector: 'app-detalle-encargado',
  templateUrl: './detalle-encargado.component.html',
  styleUrls: ['./detalle-encargado.component.css']
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

    this.alumno = this.service.get_alumno(this.id);
    console.log(this.alumno);
  }
}
