import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DetallePracticaService {

  constructor(private _http: HttpClient) { }

  obtener_practica(id_estudiante: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/get?id_estudiante=${id_estudiante}`);
    return this._http.request(req);
  }

  obtener_config_practica(id_config_practica: number){
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica?id=${id_config_practica}`);
    return this._http.request(req);
  }

  obtener_estudiante(id_estudiante: number){
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante?id=${id_estudiante}`);
    return this._http.request(req);
  }
}
