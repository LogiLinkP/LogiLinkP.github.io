import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObtenerDatosService extends Socket{
  @Output() outEven: EventEmitter<any> = new EventEmitter();
  @Output() callback: EventEmitter<any> = new EventEmitter();

  constructor(private _http: HttpClient) {
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

  obtener_estudiante(id_usuario:number) {
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante/usuario?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }

  obtener_practica(id_estudiante: number){
    const req = new HttpRequest('GET', `${environment.url_back}/practica/get_asEstudiante?id_estudiante=${id_estudiante}`);
    return this._http.request(req);
  }

  obtener_practica_encargado(id_encargado: number){
    const req = new HttpRequest('GET', `${environment.url_back}/practica/get_asEncargado?id_encargado=${id_encargado}`);
    return this._http.request(req);
  }

  obtener_config_practica(nombre: string){
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/nombre?nombre=${nombre}`);
    return this._http.request(req);
  }

  obtener_todos_config_practica(){
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/todos`);
    return this._http.request(req);
  }

  ingresar_informe(id_practica: number, key: any, id_config_informe: number, horas_trabajadas: number, id_encargado: number, correo_encargado: String){
    const req = new HttpRequest('POST', `${environment.url_back}/informe/crear`, {id_practica, key, id_config_informe, horas_trabajadas, id_encargado, correo_encargado}, {responseType: 'text'});
    return this._http.request(req);
  }

  obtener_informes(id_practica: number){
    const req = new HttpRequest('GET', `${environment.url_back}/informe/todos_practica?id_practica=${id_practica}`);
    return this._http.request(req);
  }
}
