import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObtenerDatosService {

  constructor(private _http: HttpClient) { }

  obtener_uno(id:number) {
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante?id=${id}`);
    return this._http.request(req);
  }
}
