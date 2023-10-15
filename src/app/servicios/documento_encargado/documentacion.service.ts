import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentacionService {

  constructor(private _http: HttpClient) { }

  obtener_todas(id_carrera:number){
    const req = new HttpRequest('GET', `${environment.url_back}/documento_encargados/todas?id_carrera=${id_carrera}`);
    return this._http.request(req);
  }

  obtener_encargado(id_encargado:number){
    const req = new HttpRequest('GET', `${environment.url_back}/documento_encargados/encargado?id_encargado=${id_encargado}`);
    return this._http.request(req);
  }

  nuevo_documento(id_encargado:number, id_carrera:number, tipo:string, nombre:string){
    const req = new HttpRequest('POST', `${environment.url_back}/documento_encargados/crear`, {id_encargado, id_carrera, tipo, nombre}, {responseType:"text"});
    return this._http.request(req);
  }

  eliminar_documento(id:number){
    const req = new HttpRequest('DELETE', `${environment.url_back}/documento_encargados/eliminar?id=${id}`, {responseType:"text"});
    return this._http.request(req);
  }
}
