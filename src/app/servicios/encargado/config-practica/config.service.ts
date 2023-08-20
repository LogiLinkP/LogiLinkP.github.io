import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(private _http: HttpClient) { }

  obtenerPracticasCreadas() {
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/todos`);
    return this._http.request(req);
  }

  obtenerConfigPorId(id: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/?id=${id}`);
    return this._http.request(req);
  }

  obtenerConfigPracticaNombre(nombre: string | null) {
    if (nombre == null) {
      console.log("Configuracion de practica no encontrada (null)");
      nombre = "";
    }
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/nombre?nombre=${nombre}`);
    return this._http.request(req);
  }

  crearConfigPracticaFila(nombre: string, modalidad: string, cantidad_tiempo: number, frecuencia_informes: string, informe_final: string) {
    const config = {
        nombre: nombre,
        modalidad: modalidad,
        cantidad_tiempo: cantidad_tiempo,
        frecuencia_informes: frecuencia_informes,
        informe_final: informe_final
    }

    const req = new HttpRequest('POST', `${environment.url_back}/config_practica/crear`, config, {
      responseType: 'json'
    });

    return this._http.request(req);
  }

  crearConfigPracticaCompleto(tipo_entrada:string, nombre: string, modalidad: Array<boolean>, cant_horas: Array<number>, cant_meses: Array<number>,
                                frecuencia_informes: string, informe_final: string) {
    
    let respuestas = [];

    for (let i = 0; i < modalidad.length; i++) {
        if (modalidad[i] == true) {                
            const config = {
                nombre: nombre,
                modalidad: modalidad[i],
                cantidad_tiempo: cant_horas[0], //agregar otro for?
                frecuencia_informes: frecuencia_informes,
                informe_final: informe_final
            }

            const req = new HttpRequest('POST', `${environment.url_back}/practica/crear`, config, {
                responseType: 'json'
            });
            respuestas.push(this._http.request(req));
        } else {
            const config = {
                nombre: nombre,
                modalidad: modalidad[i],
                cantidad_tiempo: cant_meses[0],
                frecuencia_informes: frecuencia_informes,
                informe_final: informe_final
            }

            const req = new HttpRequest('POST', `${environment.url_back}/practica/crear`, config, {
                responseType: 'json'
            });
            respuestas.push(this._http.request(req));
        }
    }

    return respuestas;
  }

}