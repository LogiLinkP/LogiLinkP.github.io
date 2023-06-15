import { Component, OnInit } from '@angular/core';
import { SetDetallesAlumnoService } from '../Servicios/set-detalles-alumno.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finalizacion',
  templateUrl: './finalizacion.component.html',
  styleUrls: ['./finalizacion.component.css']
})
export class FinalizacionComponent {
  id: number = 0;
  n: number = 0;
  private sub: any;
  
  constructor(private service: SetDetallesAlumnoService, private route: ActivatedRoute) { }
  
  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'] - 1; // (+) converts string 'id' to a number
      this.n = +params['n'];
    });
  }

  finalizar(){
    this.service.finalizar_practica(this.id,this.n);
  }
}
