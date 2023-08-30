import { HttpClient, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, from } from 'rxjs';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotisChatService extends Socket{

  private connectionReadySubject: Subject<void> = new Subject<void>();
  connectionReady$ = this.connectionReadySubject.asObservable();
  
  private eventSubject: Subject<any> = new Subject<any>();
  event$ = this.eventSubject.asObservable();

  @Output() outEven: EventEmitter<any> = new EventEmitter();

  
  constructor(private _http: HttpClient, private cookie: CookieService) {
    super({
      url: environment.url_back_chat,
      options: {
        query: {
          nameRoom: cookie.get('room')
        },
      }
    });
    
    if (cookie.check('room')){
      this.listen();
      console.log("Conexion establecida en ROOM:", cookie.get('room'));
    }
    else{
      console.log("Conexion no establecida con socketIO al no encontrarse room");
    }
  }
  
  listen = () => {
    this.ioSocket.on('evento', (res:any) => {console.log("Evento recibido", res); this.eventSubject.next(res);});
  }

  emitEvent = (payload = {}) => {
    console.log('emitiendo Evento', payload);
    this.ioSocket.emit('evento', payload)
  }

  waitForCookieToBeSet(): Observable<void> {
    return from(new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.cookie.check('room')) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000); // Check every 100ms
    }));
  }

  postchat(id_estudiante:number, id_encargado:number){    
    const req = new HttpRequest('POST', `${environment.url_back}/chat/crear`,{id_estudiante, id_encargado}, {responseType: 'text'});
    return this._http.request(req);
  }

  getchat(id_estudiante:number, id_encargado:number){
    const req = new HttpRequest('GET', `${environment.url_back}/chat/get?id_estudiante=${id_estudiante}&id_encargado=${id_encargado}`, {responseType: "text"});
    return this._http.request(req);
  }

  postmensaje(id_estudiante:number, id_encargado:number, mensaje:any, correo:string){
    const req = new HttpRequest('POST', `${environment.url_back}/mensaje/crear`, {id_estudiante, id_encargado, mensaje:mensaje, correo}, {responseType: 'text'});
    return this._http.request(req);
  }

  getusuario(id_usuario:number){
    console.log("id_usuario EN REQUEST", id_usuario);
    const req = new HttpRequest('GET', `${environment.url_back}/usuario/?id=${id_usuario}`);
    return this._http.request(req);
  }


}