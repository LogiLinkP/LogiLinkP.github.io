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

  obtener_notificaciones(id_usuario: number, config: string){
    const req = new HttpRequest('GET', `${environment.url_back}/notificacion/todos?id_usuario=${id_usuario}`, {id_usuario, config});
    return this._http.request(req);
  }

  obtener_todas_notificaciones(id:number){
    const req = new HttpRequest('GET', `${environment.url_back}/notificacion/todas_hasta_vistas?id_usuario=${id}`, {id});
    return this._http.request(req);
  }

  cambiar_correo_linkedin(id:number, link:string){
    const req = new HttpRequest('PUT', `${environment.url_back}/estudiante/linkedin`, {id, link}, {responseType: "text" });
    return this._http.request(req);
  }
  cambiar_carrera(id:number, id_carrera:number){
    const req = new HttpRequest('PUT', `${environment.url_back}/estudiante/carrera`, {id, id_carrera}, {responseType: "text" });
    return this._http.request(req);
  }
}
