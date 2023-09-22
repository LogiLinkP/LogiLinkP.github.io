import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(private router: Router) { }

  encargado(){
    this.router.navigate(['/admin/crear-encargado']);
  }

  carrera(){
    this.router.navigate(['/admin/crear-carrera']);
  }

  asignacion(){
    this.router.navigate(['/admin/asignacion']);
  }

  eliminar(){
    this.router.navigate(['/admin/eliminar-encargado']);
  }
}
