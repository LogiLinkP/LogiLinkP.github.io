import { GetDetallesAlumnoService } from '../encargado/resumen_practicas.service';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GestionarService {


  constructor(private service: GetDetallesAlumnoService, private http: HttpClient) { }

  registrar_practica(id_estudiante: number, id_config_practica: number,
    nombre_supervisor: string, correo_supervisor:string, nombre_empresa: string, rut_empresa: string,
    fecha_inicio: string) {

      const nueva_practica = {
        id_estudiante: id_estudiante,
        id_config_practica: id_config_practica,
        estado: "en curso",
        nombre_supervisor: nombre_supervisor,
        correo_supervisor: correo_supervisor,
        nombre_empresa: nombre_empresa,
        rut_empresa: rut_empresa,
        fecha_inicio: fecha_inicio
      }

      const req = new HttpRequest('POST', `${environment.url_back}/practica/crear`, nueva_practica, {
        responseType: 'json'
      });

      return this.http.request(req);
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
