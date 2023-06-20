import { Component, OnInit } from '@angular/core';
import { GestionarService } from '../../servicios/alumno/gestionar_practica.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'inscripcion_practica',
  templateUrl: './inscripcion_practica.component.html',
  styleUrls: ['./inscripcion_practica.component.css']
})
export class RegistroComponent {
  id: number = 0;
  n: number = 0;
  private sub: any;
  
  constructor(private service: GestionarService, private route: ActivatedRoute) { }
  
  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'] - 1; // (+) converts string 'id' to a number
      this.n = +params['n'];
    });
  }

  registrar(){
    this.service.registrar_practica(this.id,this.n);
  }
}