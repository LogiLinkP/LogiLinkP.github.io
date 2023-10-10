import { Component } from '@angular/core';
import { PublicacionesService } from 'src/app/servicios/publicaciones/publicaciones.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.scss']
})
export class PublicacionesComponent {
  publiForm: FormGroup;

  esalumno: number = -1;
  usuario: any = {};
  publicaciones:any = [];
  fixed_publicaciones:any = [];
  create_flag:number = 0;
  edit_flag:number = 0;

  Titulo:string = "";
  Enunciado:string = "";

  ID_carrera:number = -1;
  ID_encargado:number = -1;

  constructor(private service_publi:PublicacionesService, private datetime:DatePipe, private fb: FormBuilder,) {
    this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
    if (this.usuario.es_estudiante == 1) {
      this.esalumno = 1;
    }
    else {
      this.esalumno = 0;
      this.ID_carrera = this.usuario.encargado.id_carrera;
      this.ID_encargado = this.usuario.encargado.id;

    }
    this.createForm();
  }

  createForm() {
    this.publiForm = this.fb.group({
      Titulo: ['', [Validators.required, Validators.minLength(3)]],
      Enunciado: ['', [Validators.required, Validators.minLength(3)]],
      IsFijo:['', [Validators.required]]
    });
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
          let temp_publicaciones = respuesta.body;
          respuesta = [];

          if(temp_publicaciones.length != 0){
            for(let publi of temp_publicaciones){
              if(publi.isfijo == 1){
                this.fixed_publicaciones.push(publi)
              }
              else{
                this.publicaciones.push(publi)
              }
            }
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
          let temp_publicaciones = respuesta.body;
          respuesta = [];

          if(temp_publicaciones.length != 0){
            for(let publi of temp_publicaciones){
              if(publi.isfijo){
                this.fixed_publicaciones.push(publi)
              }
              else{
                this.publicaciones.push(publi)
              }
            }
          }
        }
      })
    } 
  }

  crear(){
    const data = this.publiForm.value;
    console.log(data)

    let titulo = data.Titulo
    let enunciado = data.Enunciado;

    let isfijo:boolean;
    if (data.IsFijo == "1"){
      isfijo = true;
    }else{
      isfijo = false;
    }
    
    this.service_publi.nueva_publicacion(this.ID_encargado, this.ID_carrera, titulo, enunciado, isfijo).subscribe({
      next:() => {

      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        console.log("Publicación Creada")
        this.create_flag = 0;
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
        this.edit_flag = 0;
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
        console.log("Publicación eliminada");
      }
    })
  }

  inicio_creacion(){
    this.create_flag = 1;
  }

  inicio_edicion(){
    this.edit_flag = 1;
  }
}
