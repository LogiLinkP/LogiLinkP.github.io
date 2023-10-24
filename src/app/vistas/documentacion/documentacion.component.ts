import { Component, OnInit } from '@angular/core';
import { DocumentacionService } from 'src/app/servicios/documento_encargado/documentacion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.scss']
})
export class DocumentacionComponent implements OnInit {

  bucketlink:string = "https://d2v9ocre132gvc.cloudfront.net/"

  esalumno:number = -1;
  usuario:any = {};
  documentos:any = [];

  id_carrera:number =-1;
  id_encargado:number = -1;

  constructor(private service_docu:DocumentacionService){
  this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
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
    console.log("ESALUMNO=", this.esalumno)
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
          console.log(this.documentos)
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
        this.documentos.splice(index, 1);
      },
    })
  }

  descargar_documento(key: string) {
    console.log(this.bucketlink + key)
    // abrir nueva pestaña con url de descarga, que es url_backend (sacada desde el env) + /documentos/ + documento_key
    window.open(this.bucketlink + key);
  }
}
