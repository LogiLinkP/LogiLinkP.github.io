import { Component } from '@angular/core';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  esalumno:number = -1;
  ID: number = -1;
  usuario: any = {};
  historial:any = [];
  respuesta:any = [];

  Nombre:string = "";
  Correo:string = "";
  Rut:string = "";
  Link:string = "";
  NLink:string = "";
  edicion:number = 0;


  constructor(private service: DataUsuarioService){
    this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
    if (this.usuario.es_estudiante == 1) {
      this.esalumno = 1;
      this.ID = this.usuario.estudiante.id;
    }
    else{
      this.esalumno = 0;
    }

    this.Nombre = this.usuario.nombre;
    this.Correo = this.usuario.correo;

    
    if(this.esalumno == 1){
      this.Rut = this.usuario.estudiante.rut;
      let respuesta:any = []
      this.service.obtener_estudiante(this.usuario.estudiante.id_usuario).subscribe({
        next:(data:any) => {
          respuesta = {...respuesta, ...data};
        },
        error:(error:any) => {
          console.log(error);
          return;
        },
        complete:() => {
          if(respuesta.body.perfil_linkedin == null){
            this.Link = "" 
          }
          else{
            this.Link = respuesta.body.perfil_linkedin
          }
        }
      })
    }
  }

  volver_atras(){
    window.history.back();
  }

  editar(){
    this.edicion = 1;
  }


  confirmar_cambio(){
    this.Link = this.NLink
    this.NLink = "";
    
    this.service.cambiar_correo_linkedin(this.ID, this.Link).subscribe({
      next:(data:any) => {

      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        this.edicion = 0;
      }
    })
  }
  redirecTo(){
    try{
      window.location.href = this.Link;
    } catch{
      console.log("No existe Link");
    }
    
  }
}
