import { Component } from '@angular/core';
import { SetDetallesAlumnoService } from '../../servicios/encargado/decision.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.css']
})
export class RevisionComponent {
  id: number = 0;
  n: number = 0;
  private sub: any;

  constructor(private service: SetDetallesAlumnoService, private route: ActivatedRoute){}
 
  ngOnInit(){
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'] - 1; // (+) converts string 'id' to a number
      this.n = +params['n'];
    });
  }

  aprobar(){
    this.service.aprobar_practica(this.id,this.n);
  }
  reprobar(){
    this.service.reprobar_practica(this.id,this.n);
  }
}
