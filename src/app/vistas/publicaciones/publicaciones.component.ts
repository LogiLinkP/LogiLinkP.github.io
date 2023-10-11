import { Component } from '@angular/core';
import { PublicacionesService } from 'src/app/servicios/publicaciones/publicaciones.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as dayjs from 'dayjs'
dayjs().format()
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

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
  
  fixed_edit_flags:any = [];
  edit_flags:any = [];

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
          let aux: Array<any> = respuesta.body.map((notificacion: any) => {
            notificacion.fecha_og = notificacion.fecha;
            notificacion.fecha = dayjs(notificacion.fecha, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY HH:mm");
            return notificacion;
          });
          aux.sort(function (a: any, b: any): number {
            if (a.fecha_og > b.fecha_og) return -1;
            if (a.fecha_og < b.fecha_og) return 1;
            return 0;
          })

          let temp_publicaciones = aux;

          if(temp_publicaciones.length != 0){
            for(let publi of temp_publicaciones){
              if(publi.isfijo == 1){
                this.fixed_publicaciones.push(publi)
                this.fixed_edit_flags.push(0)
              }
              else{
                this.publicaciones.push(publi)
                this.edit_flags.push(0)
              }
            }
          }
        }
      })
    }
    else{
      this.obtener_como_encargado();
    } 
  }

  obtener_como_encargado(){
    let respuesta:any = [];
    this.service_publi.obtener_encargado(this.usuario.encargado.id).subscribe({
      next:(data:any) => {
        respuesta = {...respuesta, ...data};
      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {

        let aux: Array<any> = respuesta.body.map((notificacion: any) => {
          notificacion.fecha_og = notificacion.fecha;
          notificacion.fecha = dayjs(notificacion.fecha, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY HH:mm");
          return notificacion;
        });
        aux.sort(function (a: any, b: any): number {
          if (a.fecha_og > b.fecha_og) return -1;
          if (a.fecha_og < b.fecha_og) return 1;
          return 0;
        })

        let temp_publicaciones = aux;

        if(temp_publicaciones.length != 0){
          for(let publi of temp_publicaciones){
            if(publi.isfijo){
              this.fixed_publicaciones.push(publi)
              this.fixed_edit_flags.push(0)
            }
            else{
              this.publicaciones.push(publi)
              this.edit_flags.push(0)
            }
          }
        }
      }
    })
  }

  crear(){
    const data = this.publiForm.value;

    let titulo = data.Titulo
    let enunciado = data.Enunciado;
    let fecha = this.datetime.transform((new Date), 'MM/dd/yyyy h:mm:ss')

    let isfijo:boolean;
    if (data.IsFijo == "1"){
      isfijo = true;
    }else if(data.IsFijo == "0"){
      isfijo = false;
    } else {
      return;
    }

    if(titulo == "" || enunciado == "") return;
    
    this.service_publi.nueva_publicacion(this.ID_encargado, this.ID_carrera, titulo, enunciado, fecha, isfijo).subscribe({
      next:() => {

      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        this.fixed_publicaciones = [];
        this.publicaciones = [];

        this.obtener_como_encargado();

        console.log("Publicación Creada")
        this.create_flag = 0;
      }
    })
  }

  edicion(id:number, fixed: number, index:number){
    const data = this.publiForm.value;

    let titulo = data.Titulo
    let enunciado = data.Enunciado;

    let isfijo:boolean;

    if (data.IsFijo == "1"){
      isfijo = true;
    }else if(data.IsFijo == "0"){
      isfijo = false;
    } else {
      return;
    }

    if(titulo == "" || enunciado == "") return;
    
    this.service_publi.editar_publciacion(id,titulo,enunciado).subscribe({
      next:() => {

      },
      error:(error:any) => {
        console.log(error);
      },
      complete:() => {
        this.fixed_publicaciones = [];
        this.publicaciones = [];
        
        this.obtener_como_encargado();
        
        console.log("Publicación Editada")
        /*
        if(fixed == 1 && isfijo == true){
          this.fixed_edit_flags[index] = 0;
          this.fixed_publicaciones[index].titulo = titulo;
          this.fixed_publicaciones[index].enunciado = enunciado;
        } else if(fixed == 0 && isfijo == false) {
          this.edit_flags[index] = 0;
          this.publicaciones[index].titulo = titulo;
          this.publicaciones[index].enunciado = titulo; 
        } else if(fixed == 1 && isfijo == false){
          this.fixed_edit_flags[index] = 0;
          this.fixed_publicaciones[index].titulo = titulo;
          this.fixed_publicaciones[index].enunciado = enunciado;

          this.publicaciones.push(this.fixed_publicaciones[index])
          this.fixed_publicaciones.splice(index, 1)
        } else if(fixed == 0 && isfijo == true){
          this.edit_flags[index] = 0;
          this.publicaciones[index].titulo = titulo;
          this.publicaciones[index].enunciado = titulo; 

          this.fixed_publicaciones.push(this.publicaciones[index]);
          this.publicaciones.splice(index, 1);
        }
        */
      }
    })
  }

  eliminar(id:number, fix:number, index:number){
    this.service_publi.eliminar_publicacion(id).subscribe({
      next:() => {
      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        console.log("Publicación eliminada");
        if(fix == 1){
          this.fixed_publicaciones.splice(index,1)
        } else {
          this.publicaciones.splice(index,1)
        }
      }
    })
  }

  inicio_creacion(){
    this.create_flag = 1;
  }

  inicio_edicion(fix:number, index:number){
    if(fix == 1){
      this.fixed_edit_flags[index] = 1
    } else{
      this.edit_flags[index] = 1
    }
  }
}
