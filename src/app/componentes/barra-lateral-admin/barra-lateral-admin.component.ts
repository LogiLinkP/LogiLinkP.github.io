import { Component } from '@angular/core';

@Component({
  selector: 'app-barra-lateral-alumno',
  templateUrl: './barra-lateral-alumno.component.html',
  styleUrls: ['./barra-lateral-alumno.component.scss']
})
export class BarraLateralAdminComponent {
  idUsuario: string = "";

  constructor() { 
    // obtener id usuario desde local storage en la variable auth-user.userdata.id, verficando que no esté vacío
    if (localStorage.getItem('auth-user') !== null) {
      const authUser = localStorage.getItem('auth-user');
    
      if (authUser !== null) {
        this.idUsuario = JSON.parse(authUser).userdata.id;
      }
    }
  }
}