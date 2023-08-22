import { HttpClient, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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

  
  constructor(private _http: HttpClient, private cookie: CookieService) {
    super({
      url: environment.url_back_chat,
      options: {
        query: {
          nameRoom: cookie.get('notificaciones')
        },
      }
    });
    
    if (cookie.check('notificaciones')){
      this.listen();
      console.log("Conexion establecida con el usuario:", cookie.get('notificaiones'));
    }
    else{
      console.log("Conexion no establecida con socketIO al no encontrarse el usuario");
    }
  }
  
  listen = () => {
    this.ioSocket.on('noti', (res:any) => {console.log("Evento recibido", res); this.eventSubject.next(res);});
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
