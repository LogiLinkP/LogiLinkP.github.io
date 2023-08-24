import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
    constructor(private _http: HttpClient) { }

    crearConfigPractica(nombre: string, frecuencia_informes: string, informe_final: string) {
        const config = {
            nombre: nombre,
            frecuencia_informes: frecuencia_informes,
            informe_final: informe_final
        }

        const req = new HttpRequest('POST', `${environment.url_back}/config_practica/crear`, config, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    getModalidades(id_config_practica: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/modalidad/id_config_practica?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    getConfigInforme(id_config_practica: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/config_informe/id_config_practica?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    getPreguntaEncuestaFinal(id_config_practica: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/pregunta_encuesta_final/id_config_practica?id_config_practica=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    getPreguntaSupervisor(id_config_practica: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/pregunta_supervisor/id_config_practica?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    getPreguntasInforme(id_config_practica: number) { //! deprecated?
        const req = new HttpRequest('GET', `${environment.url_back}/modalidad/id_config_practica?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    crearModalidad(id_config_practica: number, modalidad: string, cantidad_tiempo: number) {
        const config = {
            id_config_practica: id_config_practica,
            tipo_modalidad: modalidad,
            cantidad_tiempo: cantidad_tiempo
        }

        const req = new HttpRequest('POST', `${environment.url_back}/modalidad/crear`, config, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    crearConfigInforme(id_config_practica: number, tipo_informe: string) {
        const config = {
            id_config_practica: id_config_practica,
            tipo_informe: tipo_informe
        }

        const req = new HttpRequest('POST', `${environment.url_back}/config_informe/crear`, config, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    crearPreguntaInforme(id_config_informe: number, enunciado: string, tipo_respuesta: string, opciones: string) {
        const pregunta = {
            id_config_informe: id_config_informe,
            enunciado: enunciado,
            tipo_respuesta: tipo_respuesta,
            opciones: opciones
        }

        const req = new HttpRequest('POST', `${environment.url_back}/pregunta_informe/crear`, pregunta, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    crearPreguntaEncuestaFinal(id_config_practica: number, enunciado: string, tipo_respuesta: string, opciones: string) {
        const pregunta = {
            id_config_practica: id_config_practica,
            enunciado: enunciado,
            tipo_respuesta: tipo_respuesta,
            opciones: opciones
        }

        const req = new HttpRequest('POST', `${environment.url_back}/pregunta_encuesta_final/crear`, pregunta, {
            responseType: 'json'
        });

        return this._http.request(req);
    }
    
    crearPreguntaSupervisor(id_config_practica: number, enunciado: string, tipo_respuesta: string, opciones: string) {
        const pregunta = {
            id_config_practica: id_config_practica,
            enunciado: enunciado,
            tipo_respuesta: tipo_respuesta,
            opciones: opciones
        }

        const req = new HttpRequest('POST', `${environment.url_back}/pregunta_supervisor/crear`, pregunta, {
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