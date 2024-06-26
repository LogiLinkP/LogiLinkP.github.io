import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DetallePracticaService {

  constructor(private _http: HttpClient) { }

  obtener_practica(id_practica: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/?id=${id_practica}`);
    return this._http.request(req);
  }

  obtener_documentos(id_practica: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/documento/get?id_practica=${id_practica}`);
    return this._http.request(req);
  }

  obtener_documentos_extra(id_practica: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/documento_extra/get?id_practica=${id_practica}`);
    return this._http.request(req);
  }

  obtener_solicitudes_documentos(id_practica: number, id_config_practica: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/solicitud_documento/todos_docs_practica?id=${id_config_practica}&id_practica=${id_practica}`);
    return this._http.request(req);
  }

  evaluacion_encargado(id_practica:number, ev_encargado:number){
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/eval_encargado`, {id_practica, ev_encargado}, { responseType: "text" });
    return this._http.request(req);
  }
}
