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

  nuevo_documento(archivo:File, id_encargado:number, id_carrera:number, tipo:string, nombre:string, key:string, descripcion:string){
    const formData:FormData = new FormData()
    formData.append("file",archivo)
    formData.append("id_encargado", id_encargado.toString())
    formData.append("id_carrera", id_carrera.toString())
    formData.append("tipo", tipo)
    formData.append("nombre", nombre)
    formData.append("key", key)
    formData.append("descripcion", descripcion)
    const req = new HttpRequest('POST', `${environment.url_back}/documento_encargado/crear`, formData, {responseType:"json"});
    return this._http.request(req);
  }

  eliminar_documento(id:number){
    const req = new HttpRequest('DELETE', `${environment.url_back}/documento_encargado/eliminar?id=${id}`, {responseType:"json"});
    return this._http.request(req);
  }
}
