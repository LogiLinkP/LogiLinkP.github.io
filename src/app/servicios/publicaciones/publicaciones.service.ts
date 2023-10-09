import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  constructor(private _http: HttpClient, private datetime: DatePipe) { }

  obtener_todas(id_carrera:number){
    const req = new HttpRequest('GET', `${environment.url_back}/publicacion/todas'id_carrera={{id_carrera}}`, {id_carrera});
    return this._http.request(req);
  }

  obtener_encargado(id_encargado:number){
    const req = new HttpRequest('GET', `${environment.url_back}/publicacion/encargado?id_encargado={{id_encargado}}`, {id_encargado});
    return this._http.request(req);
  }

  nueva_publicacion(id_encargado:number, id_carrera:number, titulo:string, enunciado:string, isfijo:boolean){
    let fecha = this.datetime.transform((new Date), 'MM/dd/yyyy h:mm:ss')

    const req = new HttpRequest('POST', `${environment.url_back}/publicacion/crear`, {id_encargado, id_carrera, titulo, enunciado, fecha, isfijo}, {responseType:"text"});
    return this._http.request(req);
  }

  editar_publciacion(id:number, titulo:string, enunciado:string){
    const req = new HttpRequest('PUT', `${environment.url_back}/publicacion/editar`, {id, titulo, enunciado}, {responseType:"text"});
    return this._http.request(req);
  }

  eliminar_publicacion(id:number){
    const req = new HttpRequest('DELETE', `${environment.url_back}/publicacion/eliminar`, {id}, {responseType:"text"});
    return this._http.request(req);
  }
}
