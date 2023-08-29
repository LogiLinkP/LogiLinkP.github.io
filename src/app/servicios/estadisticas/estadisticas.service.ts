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
}
