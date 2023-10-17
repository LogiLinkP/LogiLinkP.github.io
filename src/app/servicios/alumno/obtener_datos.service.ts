import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObtenerDatosService {


  constructor(private _http: HttpClient) {
   }

  obtener_estudiante(id_usuario:number) {
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante/usuario?id_usuario=${id_usuario}`);
    return this._http.request(req);
  }

  obtener_practica(id_estudiante: number){
    const req = new HttpRequest('GET', `${environment.url_back}/practica/get_asEstudiante?id_estudiante=${id_estudiante}`);
    return this._http.request(req);
  }

  obtener_practica_id(id_practica: number){
    const req = new HttpRequest('GET', `${environment.url_back}/practica?id=${id_practica}`);
    return this._http.request(req);
  }

  obtener_practica_encargado(id_encargado: number){
    const req = new HttpRequest('GET', `${environment.url_back}/practica/get_asEncargado?id_encargado=${id_encargado}`);
    return this._http.request(req);
  }

  obtener_config_practica(nombre: string, id_carrera: number){
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/nombre?nombre=${nombre}&id_carrera=${id_carrera}`);
    return this._http.request(req);
  }

  obtener_todos_config_practica(){
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/todos`);
    return this._http.request(req);
  }

  ingresar_informe(id_practica: number, key: any, id_config_informe: number, horas_trabajadas: number, id_encargado: number){
    const req = new HttpRequest('POST', `${environment.url_back}/informe/crear`, {id_practica, key, id_config_informe, horas_trabajadas, id_encargado}, {responseType: 'text'});
    return this._http.request(req);
  }

  obtener_informes(id_practica: number){
    const req = new HttpRequest('GET', `${environment.url_back}/informe/todos_practica?id_practica=${id_practica}`);
    return this._http.request(req);
  }

  obtener_solicitudes_documentos_practica(id_config_practica: number, id_practica: number){
    const req = new HttpRequest('GET', `${environment.url_back}/solicitud_documento/todos_docs_practica?id=${id_config_practica}&id_practica=${id_practica}`);
    return this._http.request(req);
  }

  obtener_informe_preguntas(id_informe: number){
    const req = new HttpRequest('GET', `${environment.url_back}/informe/preguntas?id=${id_informe}`);
    return this._http.request(req);
  }

  obtener_comentarios_supervisor(id_practica: number){
    const req = new HttpRequest('POST', `${environment.url_back}/estudiante/get-comentarios`,{id_practica});
    return this._http.request(req);
  }
}
