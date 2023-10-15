import { Component } from '@angular/core';
import { DocumentacionService } from 'src/app/servicios/documento_encargado/documentacion.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.scss']
})
export class DocumentacionComponent {

  esalumno:number = -1;
  usuario:any = {};
  documentos:any = {};

  constructor(private service_docu:DocumentacionService){
  this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
    if (this.usuario.es_estudiante == 1) {
      this.esalumno = 1;
    }
    else {
      this.esalumno = 0;
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
    // abrir nueva pestaña con url de descarga, que es url_backend (sacada desde el env) + /documentos/ + documento_key
    if(solicitud_tipo == "documento"){
      window.open(environment.url_back+"/documento/download?id=" + documento_id, "_blank");
    } 
    else{
      window.open(environment.url_back+"/documento_extra/download?id=" + documento_id, "_blank");
    }
  }
}
