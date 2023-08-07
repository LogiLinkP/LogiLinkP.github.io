import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DetallePracticaService {

  constructor(private _http: HttpClient) { }

  obtener_detalle_practica() {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/get?id_estudiante=1`);
    return this._http.request(req);
  }
}
