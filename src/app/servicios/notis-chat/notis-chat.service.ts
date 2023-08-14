import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotisChatService{

  constructor(private _http: HttpClient) {}

  postchat(id_estudiante:number, id_encargado:number){
    const req = new HttpRequest('POST', `${environment.url_back}/chat/crear`,{id_estudiante:id_estudiante, id_encargado:id_encargado}, {responseType: 'text'});
    return this._http.request(req);
  }

  //getchat(id_estudiante:number, id_encargado:number){
  // const req = new HttpRequest('GET', `${environment.url_back}/chat/get`, {id_estudiante:id_estudiante, id_encargado:id_encargado}, {responseType: "text"});
  //  return this._http.request(req);
  //}


  postmensaje(id_estudiante:number, id_encargado:number, mensaje:any){
    const req = new HttpRequest('POST', `${environment.url_back}/mensaje/crear`, {id_estudiante:id_estudiante, id_encargado:id_encargado, mensaje:mensaje}, {responseType: 'text'});
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