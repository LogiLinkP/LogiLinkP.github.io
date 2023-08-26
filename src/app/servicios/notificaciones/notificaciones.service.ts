import { HttpClient, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, from } from 'rxjs';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class NotificacionesService extends Socket{

  private connectionReadySubject: Subject<void> = new Subject<void>();
  connectionReady$ = this.connectionReadySubject.asObservable();
  
  private eventSubject: Subject<any> = new Subject<any>();
  event$ = this.eventSubject.asObservable();

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
      console.log("notificacion recibida, el mensaje es", res.message);
      this.callback.emit(res);
    });
  }

  postnotificacion(id_usuario:number, mensaje:any, correo: string, estado:string){
    const req = new HttpRequest('POST', `${environment.url_back}/notificacion/crear`, {id_usuario, mensaje, correo, estado}, {responseType: 'text'});
    return this._http.request(req);
  }

  getallnotificacion(id_usuario:number){
    const req = new HttpRequest('GET', `${environment.url_back}/notificacion/todos/?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }

  notificaciones_vistas(id_usuario:number){
    const req = new HttpRequest('PUT', `${environment.url_back}/notificacion/visto`, {id_usuario});
    return this._http.request(req);
  }

  cambiar_configuración_notificaciones(id:number, estado:string){
    const req = new HttpRequest('PUT', `${environment.url_back}/usuario/estado_config`, {id, estado});
    return this._http.request(req);
  }
}
