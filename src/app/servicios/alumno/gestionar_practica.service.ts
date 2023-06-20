import { GetDetallesAlumnoService } from '../encargado/resumen_practicas.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GestionarService {

  constructor(private service: GetDetallesAlumnoService, private _http: HttpClient) { }

  registrar_practica(id: number, n: number) {
    if (n == 1) {
      this.service.alumnos[id - 1].Practica_1 = "En Desarrollo";
    }
    else {
      if (n == 2) {
        this.service.alumnos[id - 1].Practica_2 = "En Desarrollo";
      }
    }
  }

  finalizar_practica(id_estudiante: number, id_practica: number, estado: string) {
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/finalizar`, {
      id_estudiante, id_practica, estado
    }, {
      responseType: 'json'
    });
    return this._http.request(req);
  }
}
