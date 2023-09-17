import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private _http: HttpClient) { }

  obtener_empresas() {
    const req = new HttpRequest('GET', `${environment.url_back}/empresa/todos`);
    return this._http.request(req);
  }

  //terminar
  obtener_practicas_por_empresa(id: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/empresa?id=${id}`);
    return this._http.request(req);
  }

}
