import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SupervisorService {


  constructor(private _http: HttpClient) { 
  }

  sendAnswer(id_pregunta_supervisor: number, id_practica: number, respuesta: any): Observable<any> {
    const data = {
      id_pregunta_supervisor,
      id_practica,
      respuesta
    };
    const req = new HttpRequest('POST', `${environment.url_back}/respuesta_supervisor/crear`, data);
    return this._http.request(req);
  }

  /*ya no se usa porque se envía link en la misma función que la que finaliza la práctica
    enviarLink(id_practica:number, correo: string, nom_sup: string, nom_estudiante: string): Observable<any> {
    console.log("servicio correo",correo);
    console.log("servicio nom_sup",nom_sup);
    console.log("servicio nom_estudiante",nom_estudiante);
    const req = new HttpRequest('POST', `${environment.url_back}/evaluacion/gen_token`, { correo, nom_sup, nom_estudiante, id_practica });
    return this._http.request(req);
  }*/

  getPractica(token: string, iv: string): Observable<any> {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/encrypted?token=${token}&iv=${iv}`);
    return this._http.request(req);
  }

}
