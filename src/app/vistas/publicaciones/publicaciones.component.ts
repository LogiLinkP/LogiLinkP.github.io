import { Component } from '@angular/core';
import { PublicacionesService } from 'src/app/servicios/publicaciones/publicaciones.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as dayjs from 'dayjs'
import { MatSnackBar } from '@angular/material/snack-bar';
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
  
  fecha_flag = 0;

  Titulo:string = "";
  Enunciado:string = "";

  ID_carrera:number = -1;
  ID_encargado:number = -1;

  constructor(private service_publi:PublicacionesService, private datetime:DatePipe, private fb: FormBuilder,
              private _snackBar: MatSnackBar) {
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
      Titulo: ['', [Validators.required]],
      Enunciado: ['', [Validators.required]],
      IsFijo:['', [Validators.required]],
      fecha_programada1:['', [Validators.required]],
      fecha_programada2:['', [Validators.required]]
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
    this.service_publi.obtener_encargado(this.ID_encargado).subscribe({
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
      this._snackBar.open("Debe ingresar todos los datos", "Cerrar", {
        duration: 10000,
        panelClass: ['red-snackbar']
      });
      return;
    }

    let fecha_programada:any = [];

    if(this.fecha_flag == 1){
      let fechaF = data.fecha_programada1 + " " + data.fecha_programada2
      fecha_programada = new Date(fechaF);
    }

    if(titulo == "" || enunciado == ""){
      this._snackBar.open("Debe ingresar todos los datos", "Cerrar", {
        duration: 10000,
        panelClass: ['red-snackbar']
      });
      this.createForm();
      
      this.create_flag = 0;
      this.fecha_flag = 0;
      return;
    };
    
    this.service_publi.nueva_publicacion(this.ID_encargado, this.ID_carrera, titulo, enunciado, fecha, isfijo, fecha_programada).subscribe({
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
        this.createForm();
        this.create_flag = 0;
        this.fecha_flag = 0;
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
      this._snackBar.open("Debe ingresar todos los datos", "Cerrar", {
        duration: 10000,
        panelClass: ['red-snackbar']
      });
      return;
    }

    if(titulo == "" || enunciado == ""){
      this._snackBar.open("Debe ingresar todos los datos", "Cerrar", {
        duration: 10000,
        panelClass: ['red-snackbar']
      });
      return;
    }
    this.service_publi.editar_publciacion(id,titulo,enunciado, isfijo).subscribe({
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
        if(data.IsFijo == 1){
          this.fixed_edit_flags[index] = 0
        }
        else{
          this.edit_flags[index] = 0;
        }
        this.createForm();
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

  cancelar_creacion(){
    this.create_flag = 0;
  }

  inicio_edicion(fix:number, index:number){
    if(fix == 1){
      this.fixed_edit_flags[index] = 1
    } else{
      this.edit_flags[index] = 1
    }
  }

  terminar_edicion(fix:number, index:number){
    if(fix == 1){
      this.fixed_edit_flags[index] = 0
    } else{
      this.edit_flags[index] = 0
    }
    
  }

  checkout(arg: any) {
    this.fecha_flag = Number(arg.target.value)
  }
}
