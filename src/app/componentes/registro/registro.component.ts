import { Component, OnInit } from '@angular/core';
import { SetDetallesAlumnoService } from '../../servicios/encargado/decision.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
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

  registrar(){
    this.service.registrar_practica(this.id,this.n);
  }


}