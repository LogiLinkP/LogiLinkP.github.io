import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  constructor(private _http: HttpClient) { }

  sendAnswer(id_estudiante: number, id_config_practica: number, respuestas: any): Observable<any> {
    const data = {
      id_estudiante,
      id_config_practica,
      respuestas
    };
    const req = new HttpRequest('POST', `${environment.url_back}/supervisor/respuesta`, data);
    return this._http.request(req);
  }
}
