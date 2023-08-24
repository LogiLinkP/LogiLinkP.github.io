import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SetDetallesAlumnoService {

  constructor(private _http: HttpClient) { }

  aprobar_practica(id_usuario:number , id_estudiante: number, id_config_practica: number, aprobacion: 0 | 1, correo_estudiante:String) {
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/aprobar`, {
      id_usuario, id_estudiante, id_config_practica, aprobacion
    }, {
      responseType: 'json'
    });
    return this._http.request(req);
  }

}