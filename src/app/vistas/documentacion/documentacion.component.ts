import { Component, OnInit } from '@angular/core';
import { DocumentacionService } from 'src/app/servicios/documento_encargado/documentacion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.scss']
})
export class DocumentacionComponent implements OnInit {

  esalumno:number = -1;
  usuario:any = {};
  documentos:any = {};

  id_carrera:number =-1;
  id_encargado:number = -1;

  constructor(private service_docu:DocumentacionService){
  this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
  console.log(this.usuario)
    if (this.usuario.es_estudiante == 1) {
      this.esalumno = 1;
      this.id_carrera = this.usuario.estudiante.id_carrera;
    }
    else {
      this.esalumno = 0;
      this.id_carrera = this.usuario.encargado.id_carrera;
      this.id_encargado = this.usuario.encargado.id;
    }
  }

  ngOnInit(){
    let respuesta:any = [];
    if(this.esalumno == 1){
      this.service_docu.obtener_todas(this.id_carrera).subscribe({
        next:(data:any) => {
          respuesta = {...respuesta, ...data}
        },
        error:(error:any) => {
          console.log(error);
        },
        complete:() => {
          this.documentos = respuesta.body;
        }
      })
    } else {
      this.service_docu.obtener_encargado(this.id_encargado).subscribe({
        next:(data:any) => {
          respuesta = {...respuesta, ...data}
        },
        error:(error:any) => {
          console.log(error);
        },
        complete:() => {
          this.documentos = respuesta.body;
        }
      })
    }
  }

  eliminar(id:number, index:number){
    let respuesta:any[];
    this.service_docu.eliminar_documento(id).subscribe({
      next:(data:any) => {
        respuesta={...respuesta, ...data}
      },
      error:(error:any) => {
        console.log(error);
        return
      },
      complete:() => {
        this.documentos.splice(index,1)
      },
    })
  }

  descargar_documento(documento_id: string, solicitud_tipo: string) {
    //console.log("decargar documento")
    console.log(documento_id)
    console.log(environment.url_back+"/documento_encargado/download?id=" + documento_id, "_blank")
    // abrir nueva pestaña con url de descarga, que es url_backend (sacada desde el env) + /documentos/ + documento_key
    window.open(environment.url_back+"/documento_encargado/download?id=" + documento_id);
  }
}
