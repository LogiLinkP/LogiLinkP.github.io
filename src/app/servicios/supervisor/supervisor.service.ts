import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService extends Socket{
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

  sendAnswer(id_estudiante: number, id_config_practica: number, respuestas: any, evaluacion: number): Observable<any> {
    const data = {
      id_estudiante,
      id_config_practica,
      respuestas,
      evaluacion
    };
    const req = new HttpRequest('POST', `${environment.url_back}/supervisor/respuesta`, data);
    return this._http.request(req);
  }

  enviarLink(id_practica:number, correo: string, nom_sup: string, nom_estudiante: string): Observable<any> {
    console.log("servicio correo",correo);
    console.log("servicio nom_sup",nom_sup);
    console.log("servicio nom_estudiante",nom_estudiante);
    const req = new HttpRequest('POST', `${environment.url_back}/evaluacion/gen_token`, { correo, nom_sup, nom_estudiante, id_practica });
    return this._http.request(req);
  }

  getPractica(token: string, iv: string): Observable<any> {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/encrypted?token=${token}&iv=${iv}`);
    return this._http.request(req);
  }

}
