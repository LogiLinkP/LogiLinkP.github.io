import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BarraLateralService {

  constructor(private _http: HttpClient) { }

  obtenerPracticasCreadas() {
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/todos`);
    return this._http.request(req);
  }

  obtenerConfigPorId(id: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/?id=${id}`);
    return this._http.request(req);
  }

  obtenerConfigPracticaNombre(nombre: string | null,id_carrera: number) {
    if (nombre == null) {
      console.log("Configuracion de practica no encontrada (null)");
      nombre = "";
    }

    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/nombre?nombre=${nombre}&id_carrera=${id_carrera}`);
    return this._http.request(req);
  }

}
