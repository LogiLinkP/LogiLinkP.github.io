import { HttpClient, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotisChatService extends Socket{
  
  private eventSubject: Subject<any> = new Subject<any>();
  event$ = this.eventSubject.asObservable();

  @Output() outEven: EventEmitter<any> = new EventEmitter();

  
  constructor(private _http: HttpClient, cookie: CookieService) {
    super({
      url: environment.url_back_chat,
      options: {
        query: {
          nameRoom: cookie.get('room')
        },
      }
    });
    
    
    this.listen();
  }

  

  listen = () => {
    this.ioSocket.on('evento', (res:any) => {console.log("Evento recibido", res); this.eventSubject.next(res);});
    
  }

  emitEvent = (payload = {}) => {
    console.log('emitiendo Evento', payload);
    this.ioSocket.emit('evento', payload)
  }

  postchat(id_estudiante:number, id_encargado:number){    
    const req = new HttpRequest('POST', `${environment.url_back}/chat/crear`,{id_estudiante, id_encargado}, {responseType: 'text'});
    return this._http.request(req);
  }

  getchat(id_estudiante:number, id_encargado:number){
    const req = new HttpRequest('GET', `${environment.url_back}/chat/get?id_estudiante=${id_estudiante}&id_encargado=${id_encargado}`, {responseType: "text"});
    return this._http.request(req);
  }

  postmensaje(id_estudiante:number, id_encargado:number, mensaje:any){
    const req = new HttpRequest('POST', `${environment.url_back}/mensaje/crear`, {id_estudiante, id_encargado, mensaje:mensaje}, {responseType: 'text'});
    return this._http.request(req);
  }
  
  
  postnotificacion(id_usuario:number, mensaje:any){
    const req = new HttpRequest('POST', `${environment.url_back}/notificacion/crear`, {id_usuario:id_usuario, mensaje:mensaje}, {responseType: 'text'});
    return this._http.request(req);
  }

  getallnotificacion(id_usuario:number){
    const req = new HttpRequest('GET', `${environment.url_back}/notificacion/todos/?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }

  deleteallnotificacion(id_usuario:number){
    const req = new HttpRequest('DELETE', `${environment.url_back}/notificacion/eliminar/?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }
}