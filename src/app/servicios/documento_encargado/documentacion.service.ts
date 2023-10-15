import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentacionService {

  constructor(private _http: HttpClient) { }

  obtener_todas(id_carrera:number){
    const req = new HttpRequest('GET', `${environment.url_back}/documento_encargado/todas?id_carrera=${id_carrera}`);
    return this._http.request(req);
  }

  obtener_encargado(id_encargado:number){
    const req = new HttpRequest('GET', `${environment.url_back}/documento_encargado/encargado?id_encargado=${id_encargado}`);
    return this._http.request(req);
  }

  nuevo_documento(id_encargado:number, id_carrera:number, tipo:string, nombre:string, key:string){
    const req = new HttpRequest('POST', `${environment.url_back}/documento_encargado/crear`, {id_encargado, id_carrera, tipo, nombre, key}, {responseType:"text"});
    return this._http.request(req);
  }

  eliminar_documento(id:number){
    const req = new HttpRequest('DELETE', `${environment.url_back}/documento_encargado/eliminar?id=${id}`, {responseType:"text"});
    return this._http.request(req);
  }
}
