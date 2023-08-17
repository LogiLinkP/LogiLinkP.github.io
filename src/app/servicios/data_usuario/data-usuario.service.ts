import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataUsuarioService {

  constructor(private _http: HttpClient) { }
  obtener_estudiante(id_usuario:number) {
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante/usuario?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }

  obtener_encargado(id_usuario:number) {
    const req = new HttpRequest('GET', `${environment.url_back}/encargado/usuario?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }
}
