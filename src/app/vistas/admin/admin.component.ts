import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(public router: Router) { }

  encargado(){
    this.router.navigate(['/crear-encargado']);
  }

  carrera(){
    this.router.navigate(['/crear-carrera']);
  }
}
