import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private _http: HttpClient) { }


  get_empresas() {
    const req = new HttpRequest('GET', `${environment.url_back}/empresa/todos`);
    return this._http.request(req);
  }

  obtener_empresas() {
    const req = new HttpRequest('GET', `${environment.url_back}/empresa/todos`);
    return this._http.request(req);
  }

  agregar_empresa_auto(rut_empresa: string) {
    const req = new HttpRequest('POST', `${environment.url_back}/empresa/agregar_empresa_auto?rut=${rut_empresa}`, {}, {
      responseType: "json"
    });
    return this._http.request(req);
  }

  agregar_empresa_manual(nombre_empresa: string, rut_empresa: string) {
    const req = new HttpRequest('POST', `${environment.url_back}/empresa/agregar_empresa_manual?rut=${rut_empresa}&nombre=${nombre_empresa}`, {}, {
      responseType: "json"
    });
    return this._http.request(req);
  }

  //terminar
  obtener_practicas_por_empresa(id: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/empresa?id=${id}`);
    return this._http.request(req);
  }
}
