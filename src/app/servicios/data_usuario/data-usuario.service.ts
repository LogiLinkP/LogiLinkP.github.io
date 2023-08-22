import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataUsuarioService {

  constructor(private _http: HttpClient) { }
  obtener_estudiante(id_usuario:number) {
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante/usuario?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }

  obtener_encargado(id_usuario:number) {
    const req = new HttpRequest('GET', `${environment.url_back}/encargado/usuario?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }

  obtener_usuario(id_usuario:number){
    const req = new HttpRequest('GET', `${environment.url_back}/usuario?id=${id_usuario}`);
    return this._http.request(req);
  }
  obtener_estudiantes_practicas(id_encargado: number){
    const req = new HttpRequest('GET', `${environment.url_back}/encargado/estudiantes?id_encargado=${id_encargado}`);
    return this._http.request(req);
  }
  obtener_encargados_practicas(id_estudiante: number){
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante/encargados?id_estudiante=${id_estudiante}`);
    return this._http.request(req);
  }

  obtener_notificaciones(id_usuario: number){
    const req = new HttpRequest('GET', `${environment.url_back}/notificacion/todos?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }
}
