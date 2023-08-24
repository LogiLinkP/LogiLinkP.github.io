import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreguntasEncuestaFinalService {

  constructor(private _http: HttpClient) { }

  obtener_preguntas(id_config_practica: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/pregunta_encuesta_final/id_config_practica?id_config_practica=${id_config_practica}`);
    return this._http.request(req);
  }

  agregar_respuesta(id_pregunta_encuesta_final: number, respuesta: string) {
    const req = new HttpRequest('POST', `${environment.url_back}/respuesta_encuesta_final/crear`, {
      id_pregunta_encuesta_final: id_pregunta_encuesta_final,
      respuesta: respuesta
    });
    return this._http.request(req);
  }

}
