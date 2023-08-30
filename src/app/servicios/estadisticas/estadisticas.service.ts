import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(private _http: HttpClient) { }

  obtener_todas_config_practicas() {
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/todos`);
    return this._http.request(req);
  }

  obtener_respuestas_encuesta_final() {
    const req = new HttpRequest('GET', `${environment.url_back}/respuesta_encuesta_final/todos`);
    return this._http.request(req);
  }

  obtener_todas_preguntas_encuesta_final() {
    const req = new HttpRequest('GET', `${environment.url_back}/pregunta_encuesta_final/todos`);
    return this._http.request(req);
  }

  obtener_todas_estadisticas(){
    const req = new HttpRequest('GET', `${environment.url_back}/estadistica/todos`);
    return this._http.request(req);
  }

  crear_estadistica(estadistica: any) {
    const req = new HttpRequest('POST', `${environment.url_back}/estadistica/crear`, estadistica);
    return this._http.request(req);
  }

  actualizar_estadistica(estadistica: any) {
    const req = new HttpRequest('PUT', `${environment.url_back}/estadistica/actualizar`, estadistica);
    return this._http.request(req);
  }

  borrar_estadistica(estadistica: any) {
    const req = new HttpRequest('DELETE', `${environment.url_back}/estadistica/eliminar_todos`, estadistica);
    return this._http.request(req);
  }

}
