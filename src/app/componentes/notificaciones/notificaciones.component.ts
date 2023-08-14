import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent {
  Id: number = -1;
  Nnotif: String = "";
  Historial: any=[];

  constructor(private router: ActivatedRoute) {
    this.router.params.subscribe(params => {this.Id = +params['id'];});
  }

}
