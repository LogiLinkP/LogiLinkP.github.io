import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObtenerDatosService {

  constructor(private _http: HttpClient) { }

  obtener_alumno(id:number) {
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante?id=${id}`);
    return this._http.request(req);
  }

  obtener_practica(id_estudiante: number){
    const req = new HttpRequest('GET', `${environment.url_back}/practica/get?id_estudiante=${id_estudiante}`);
    return this._http.request(req);
  }

  obtener_config_practica(id_practica: number){
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica?id=${id_practica}`);
    return this._http.request(req);
  }

  ingresar_informe(id_practica: number, key: any, id_config_informe: number){
    const req = new HttpRequest('POST', `${environment.url_back}/informe/crear`, {id_practica:id_practica, key:key, id_config_informe:id_config_informe});
    return this._http.request(req);
  }

  obtener_informes(id_practica: number){
    const req = new HttpRequest('GET', `${environment.url_back}/informe/todos_practica?id_practica=${id_practica}`);
    return this._http.request(req);
  }

  actualizar_hora(id_practica: number, horas: number){
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/actualizar`, {id:id_practica, horas:horas});
    console.log(req.body);
    return this._http.request(req);
  }
}
