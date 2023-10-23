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

  sendAnswer(ids_preguntas_supervisor: any, id_practica: number, respuestas: any): Observable<any> {
    const data = {
      ids_preguntas_supervisor,
      id_practica,
      respuestas
    };
    const req = new HttpRequest('POST', `${environment.url_back}/respuesta_supervisor/responder_encuesta`, data);
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

  getPracticaEncriptada(token: string, iv: string): Observable<any> {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/encrypted?token=${token}&iv=${iv}`);
    return this._http.request(req);
  }

  setFragmentos(id_practica: number, data:any): Observable<any> {
    const req = new HttpRequest('PUT', `${environment.url_back}/similitud/frases_representativas_practica/${id_practica}`, data);    
    return this._http.request(req);
  }

  setRepeticiones(id_practica: number): Observable<any> {
    const req = new HttpRequest('POST', `${environment.url_back}/similitud/textos_repetidos`, {id_practica});
    return this._http.request(req);
  }

  getAptitudes(id_practica: number) {
    const req = new HttpRequest('POST',`${environment.url_back}/pregunta_supervisor/aptitudes`, {id_practica});
    return this._http.request(req);
  }

  confirmarInicioPractica(id_practica: number): Observable<any> {
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/actualizar`, {id: id_practica, estado: environment.estado_practica.en_curso});
    return this._http.request(req);
  }
}
