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
    const req = new HttpRequest('GET', `${environment.url_back}/practica/${id_practica}`);
    return this._http.request(req);
  }

  obtener_documentos(id_practica: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/documento/get?id_practica=${id_practica}`);
    return this._http.request(req);
  }
}
