import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlagioService {

  constructor(private _http: HttpClient) {

  }

  get_plagio_por_practica(id_practica: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/plagio?id_practica=${id_practica}`, { responseType: 'json' });
    return this._http.request(req);
  }
}
