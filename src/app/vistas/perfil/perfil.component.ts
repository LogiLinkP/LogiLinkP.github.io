import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  esalumno:number = -1;
  usuario: any = {};
  historial:any = [];
  respuesta:any = [];

  Nombre:string = "";
  Correo:string = "";
  Rut:string = "";
  Link:string = "";
  edicion:number = 0;


  constructor(){
    this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
    if (this.usuario.es_estudiante == 1) {
      this.esalumno = 1;
    }
    else{
      this.esalumno = 0;
    }

    this.Nombre = this.usuario.nombre;
    this.Correo = this.usuario.correo;

    
    if(this.esalumno == 1){
      this.Rut = this.usuario.estudiante.rut;
      if(this.usuario.estudiante.perfil_linkedin == null){
        this.Link = "Wena Cabros"
      } else {
        this.Link = this.usuario.estudiante.perfil_linkedin;
      }
    }
    else if(this.esalumno != 0){
      console.log(this.usuario.encargado)
    }
  }

  volver_atras(){
    window.history.back();
  }

  editar(){
    this.edicion = 1;
  }

  confirmar_cambio(){
    this.edicion = 0;
  }
}
