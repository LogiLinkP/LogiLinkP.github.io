import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  constructor(private _http: HttpClient) { }

  sendAnswer(id_estudiante: number, id_config_practica: number, respuestas: any, evaluacion: number): Observable<any> {
    const data = {
      id_estudiante,
      id_config_practica,
      respuestas,
      evaluacion
    };
    const req = new HttpRequest('POST', `${environment.url_back}/supervisor/respuesta`, data);
    return this._http.request(req);
  }

  enviarLink(correo: string, nom_sup: string, nom_estudiante: string): Observable<any> {
    console.log("servicio correo",correo);
    console.log("servicio nom_sup",nom_sup);
    console.log("servicio nom_estudiante",nom_estudiante);
    const req = new HttpRequest('POST', `${environment.url_back}/supervisor/gen_token`, { correo, nom_sup, nom_estudiante });
    return this._http.request(req);
  }

}
