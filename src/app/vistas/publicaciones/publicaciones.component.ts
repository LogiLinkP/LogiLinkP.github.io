import { Component } from '@angular/core';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { PublicacionesService } from 'src/app/servicios/publicaciones/publicaciones.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss']
})
export class PublicacionesComponent {

  esalumno: number = -1;
  usuario: any = {};
  publicaciones:any = [];

  constructor(private service_publi:PublicacionesService) {
    this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
    if (this.usuario.es_estudiante == 1) {
      this.esalumno = 1;
    }
    else {
      this.esalumno = 0;
    }
  }

  ngOnInit(){
    console.log(this.usuario);
    let respuesta:any = []
    if(this.esalumno == 1){
      this.service_publi.obtener_todas(this.usuario.estudiante.id_carrera).subscribe({
        next:(data:any) => {
          respuesta = {...respuesta, ...data};
        },
        error:(error:any) => {
          console.log(error);
          return
        },
        complete:() => {
          let temp_publicaciones = respuesta;
          let temp_publicaciones2: any = [];
          respuesta = [];

          for(let publi of temp_publicaciones){
            if(publi.isfijo == 1){
              temp_publicaciones.push(publi)
            }
            else{
              temp_publicaciones2.push(publi)
            }
          }

          this.publicaciones = temp_publicaciones

          for(let publi of temp_publicaciones2){
            this.publicaciones.push(publi)
          }
        }
      })
    }
    else{
      this.service_publi.obtener_encargado(this.usuario.encargado.id).subscribe({
        next:(data:any) => {
          respuesta = {...respuesta, ...data};
        },
        error:(error:any) => {
          console.log(error);
          return;
        },
        complete:() => {
          let temp_publicaciones = respuesta;
          let temp_publicaciones2: any = [];
          respuesta = [];

          for(let publi of temp_publicaciones){
            if(publi.isfijo == 1){
              temp_publicaciones.push(publi)
            }
            else{
              temp_publicaciones2.push(publi)
            }
          }

          this.publicaciones = temp_publicaciones

          for(let publi of temp_publicaciones2){
            this.publicaciones.push(publi)
          }
        }
      })
    } 
  }

  crear(titulo:string, enunciado:string, isfijo:boolean){
    this.service_publi.nueva_publicacion(this.usuario.encargado.id, this.usuario.encargado.id_carrera, titulo, enunciado, isfijo).subscribe({
      next:() => {

      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        console.log("Publicación Creada")
      }
    })
  }

  edicion(id:number, titulo:string, enunciado:string){
    this.service_publi.editar_publciacion(id,titulo,enunciado).subscribe({
      next:() => {

      },
      error:(error:any) => {
        console.log(error);
      },
      complete:() => {
        console.log("Publicación Editada")
      }
    })
  }

  eliminar(id:number){
    this.service_publi.eliminar_publicacion(id).subscribe({
      next:() => {

      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        console.log("Publ")
      }
    })
  }
}
