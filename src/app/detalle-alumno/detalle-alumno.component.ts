import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDetallesAlumnoService } from '../Servicios/get-detalles-alumno.service';

@Component({
  selector: 'app-detalle-alumno',
  templateUrl: './detalle-alumno.component.html',
  styleUrls: ['./detalle-alumno.component.css']
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

    this.alumno = this.service1.get_alumno(this.id);
    console.log(this.alumno);
  }


}
