import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';

import * as dayjs from 'dayjs'
dayjs().format()
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

@Component({
  selector: 'app-notis-historial',
  templateUrl: './notis-historial.component.html',
  styleUrls: ['./notis-historial.component.scss']
})
export class NotisHistorialComponent implements OnInit {

  esalumno:number = -1;
  usuario: any = {};
  historial:any = [];
  respuesta:any = [];

  constructor(private service_noti: DataUsuarioService ){
    this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
    if (this.usuario.es_estudiante == 1) {
      this.esalumno = 1;
    }
    else{
      this.esalumno = 0;
    }
  }

  volver_atras(){
    window.history.back();
  }
  
  ngOnInit(){
    this.service_noti.obtener_todas_notificaciones(this.usuario.id).subscribe({
      next:(data:any) => {
        this.respuesta = {...this.respuesta, ...data};
      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        console.log(this.respuesta)
        this.historial = this.respuesta.body;
        this.historial = this.historial.map((notificacion:any ) => {
          notificacion.fecha = dayjs(notificacion.fecha, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY HH:mm");
          return notificacion;
        });
        console.log(this.historial);
      }
    })
  }
}
