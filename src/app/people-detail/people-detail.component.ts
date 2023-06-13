import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetDetallesAlumnoService } from '../Servicios/get-detalles-alumno.service';

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.component.html',
  styleUrls: ['./people-detail.component.css']
})
export class PeopleDetailComponent {
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