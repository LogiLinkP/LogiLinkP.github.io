import { GetDetallesAlumnoService } from '../encargado/resumen_practicas.service';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class GestionarService extends Socket{
  
  @Output() outEven: EventEmitter<any> = new EventEmitter();
  @Output() callback: EventEmitter<any> = new EventEmitter();

  constructor(private service: GetDetallesAlumnoService, private http: HttpClient) {
    super({
      url: environment.url_back_chat,
      options: {
        query: {
          nameRoom: "notificaciones" + JSON.parse(localStorage.getItem("auth-user") || "{}").userdata.id
        },
      }
    });
    console.log("sala notificaciones" + JSON.parse(localStorage.getItem("auth-user") || "{}").userdata.id);
    this.listen();
  }

  listen = () => {
    this.ioSocket.on('notificacion', (res:any) => {
      console.log("notificacion recibida, el mensaje es", res.texto);
      this.callback.emit(res);
    });
  }

  registrar_empresa(nombre_empresa: string, rut_empresa: string) {
    console.log("Registrando empresa con nombre: ", nombre_empresa, " y rut: ", rut_empresa)
    const nueva_empresa = {
      nombre_empresa: nombre_empresa,
      rut_empresa: rut_empresa,
      empresa_verificada: false,
      dominios_empresa: ""
    }
    const req = new HttpRequest('POST', `${environment.url_back}/empresa/crear`, nueva_empresa, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  registrar_supervisor(nombre_supervisor: string, correo_supervisor: string) {
    const nuevo_supervisor = {
      id_usuario: null,
      nombre: nombre_supervisor,
      correo: correo_supervisor,
      carnet_rostro: false,
      es_correo_institucional: false
    }
    const req = new HttpRequest('POST', `${environment.url_back}/supervisor/crear`, nuevo_supervisor, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  registrar_practica(id_estudiante: number, id_config_practica: number, fecha_inicio: string,
                      id_empresa:number, id_supervisor:number, id_encargado:number) {
    const nueva_practica = {
      estado: environment.estado_practica.en_curso,
      id_estudiante: id_estudiante,
      id_config_practica: id_config_practica,
      fecha_inicio: fecha_inicio,
      horas: 0,
      id_empresa: id_empresa,
      id_supervisor: id_supervisor,
      id_encargado: id_encargado
    }
    const req = new HttpRequest('POST', `${environment.url_back}/practica/crear`, nueva_practica, {
      responseType: 'text'
    });         
    return this.http.request(req);
  }   


  finalizar_practica(id_estudiante: number, id_practica: number, estado: string) {
    console.log("Finalizando practica con id: ", id_practica, " y estado: ", estado, " para estudiante con id: ", id_estudiante)
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/finalizar`, {
      id_estudiante, id_practica, estado
    }, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  buscar_config_practica(nombre: string, modalidad: string, cantidad_tiempo: number) {
    console.log("Buscando configuracion de practica con nombre: ", nombre, " modalidad: ", modalidad, " y cantidad: ", cantidad_tiempo)
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/buscar?nombre=${nombre}&modalidad=${modalidad}&cantidad_tiempo=${cantidad_tiempo}`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  buscar_encargados() {
    const req = new HttpRequest('GET', `${environment.url_back}/encargado/todos`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
