import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RespuestaRamosService {

  constructor(private _http: HttpClient) { }

  obtener_respuesta_ramos(id: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/respuesta_ramos?id=${id}`);
    return this._http.request(req);
  }

  crear_respuesta_ramos( id_carrera: number, respuesta: string, id_practica: number) {
    const req = new HttpRequest('POST', `${environment.url_back}/respuesta_ramos/crear`, {
      id_carrera: id_carrera, 
      respuesta: respuesta,
      id_practica: id_practica
    });
    return this._http.request(req);
  }

}
