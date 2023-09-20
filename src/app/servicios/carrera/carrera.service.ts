import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  constructor(private _http: HttpClient) { }

  obtener_carrera(id: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/carrera?id=${id}`);
    return this._http.request(req);
  }

}
