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

  agregar_calificacion_empresa(id_practica: number, calificacion_empresa: number) {
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/actualizar`, {
      id: id_practica,
      calificacion_empresa: calificacion_empresa
    });
    return this._http.request(req);
  }

  agregar_comentario_empresa(id_practica: number, comentario_empresa: string) {
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/actualizar`, {
      id: id_practica,
      comentario_empresa: comentario_empresa
    });
    return this._http.request(req);
  }

}
