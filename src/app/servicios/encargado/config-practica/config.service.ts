import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    constructor(private _http: HttpClient) { }

    crearConfigPractica(nombre: string, frecuencia_informes: string, informe_final: string, id_carrera: number, doc_direst: boolean) {
        const config = {
            nombre: nombre,
            frecuencia_informes: frecuencia_informes,
            informe_final: informe_final,
            id_carrera,
            doc_direst
        }

        const req = new HttpRequest('POST', `${environment.url_back}/config_practica/crear`, config, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    actualizarConfigPractica(id: number, activada: boolean) {
        const config = {
            id: id,
            activada: activada
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/config_practica/actualizar`, config, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    getAptitudes(id_config_practica: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/pregunta_supervisor/aptitudes?id=${id_config_practica}`, {
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

    getSolicitudDocumento(id_config_practica: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/solicitud_documento/id_config_practica?id=${id_config_practica}`, {
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

    actualizarModalidad(id_config_practica: number, modalidad: string, cantidad_tiempo: number) {
        const config = {
            id_config_practica: id_config_practica,
            tipo_modalidad: modalidad,
            cantidad_tiempo: cantidad_tiempo
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/modalidad/actualizar`, config, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    crearConfigInforme(id_config_practica: number, tipo_informe: string, archivo_o_encuesta: string = "", 
    tipo_archivo: string = "", plantilla: string = "", file_plantilla: File = new File([], "")) {
        //console.log("todo: ", id_config_practica, tipo_informe, archivo_o_encuesta, tipo_archivo, plantilla, file_plantilla)
        if(archivo_o_encuesta == "archivo" && plantilla != ""){
            const formData:FormData = new FormData()
            formData.append('id_config_practica', id_config_practica.toString())
            formData.append('tipo_informe', tipo_informe)
            formData.append('archivo_o_encuesta', archivo_o_encuesta)
            formData.append('tipo_archivo', tipo_archivo)
            formData.append('plantilla', plantilla)
            formData.append('file_plantilla', file_plantilla)
            const req = new HttpRequest('POST', `${environment.url_back}/config_informe/crearConArchivo`, formData, {responseType:"json"});
            return this._http.request(req);

        }
        else{
            const config = {
                id_config_practica: id_config_practica,
                tipo_informe: tipo_informe,
                archivo_o_encuesta,
                tipo_archivo,
                plantilla
            }

            const req = new HttpRequest('POST', `${environment.url_back}/config_informe/crear`, config, {
                responseType: 'json'
            });
        

            return this._http.request(req);
        }
    }

    actualizarConfigInforme(id_config_practica: number, tipo_informe: string) {
        const config = {
            id_config_practica: id_config_practica,
            tipo_informe: tipo_informe
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/config_informe/actualizar`, config, {
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

    actualizarPreguntaInforme(id_config_informe: number, enunciado: string, tipo_respuesta: string, opciones: string) {
        const pregunta = {
            id_config_informe: id_config_informe,
            enunciado: enunciado,
            tipo_respuesta: tipo_respuesta,
            opciones: opciones
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/pregunta_informe/actualizar`, pregunta, {
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

    actualizarPreguntaEncuestaFinal(id_config_practica: number, enunciado: string, tipo_respuesta: string, opciones: string) {
        const pregunta = {
            id_config_practica: id_config_practica,
            enunciado: enunciado,
            tipo_respuesta: tipo_respuesta,
            opciones: opciones
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/pregunta_encuesta_final/actualizar`, pregunta, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    crearPreguntaSupervisor(id_config_practica: number, enunciado: string, tipo_respuesta: string, opciones: string, fija: boolean) {
        const pregunta = {
            id_config_practica: id_config_practica,
            enunciado: enunciado,
            tipo_respuesta: tipo_respuesta,
            opciones: opciones,
            fija: fija
        }

        const req = new HttpRequest('POST', `${environment.url_back}/pregunta_supervisor/crear`, pregunta, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    actualizarPreguntaSupervisor(id_config_practica: number, enunciado: string, tipo_respuesta: string, opciones: string) {
        const pregunta = {
            id_config_practica: id_config_practica,
            enunciado: enunciado,
            tipo_respuesta: tipo_respuesta,
            opciones: opciones
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/pregunta_supervisor/actualizar`, pregunta, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    crearSolicitudDocumento(id_config_practica: number, nombre: string, descripcion: string, tipo: string,) {
        const pregunta = {
            id_config_practica: id_config_practica,
            tipo_archivo: tipo,
            nombre_solicitud: nombre,
            descripcion: descripcion
        }

        const req = new HttpRequest('POST', `${environment.url_back}/solicitud_documento/crear`, pregunta, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    actualizarSolicitudDocumento(id_config_practica: number, tipo: string, nombre: string, descripcion: string) {
        const pregunta = {
            id_config_practica: id_config_practica,
            tipo_archivo: tipo,
            nombre_solicitud: nombre,
            descripcion: descripcion
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/solicitud_documento/actualizar`, pregunta, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    crearConfigPracticaCompleto(tipo_entrada: string, nombre: string, modalidad: Array<boolean>, cant_horas: Array<number>, cant_meses: Array<number>,
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

    delConfigPractica(id: number) {
        const req = new HttpRequest('DELETE', `${environment.url_back}/config_practica/eliminar?id=${id}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    delModalidad(id_config_practica: number) {
        const req = new HttpRequest('DELETE', `${environment.url_back}/modalidad/eliminar_config?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    delConfigInforme(id_config_practica: number) {
        const req = new HttpRequest('DELETE', `${environment.url_back}/config_informe/eliminar_config?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    delPreguntaInforme(id_config_informe: number) {
        const req = new HttpRequest('DELETE', `${environment.url_back}/pregunta_informe/eliminar_config?id=${id_config_informe}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    delPreguntaEncuestaFinal(id_config_practica: number) {
        const req = new HttpRequest('DELETE', `${environment.url_back}/pregunta_encuesta_final/eliminar_config?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    delPreguntaSupervisor(id_config_practica: number) {
        const req = new HttpRequest('DELETE', `${environment.url_back}/pregunta_supervisor/eliminar_config?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    delSolicitudDocumento(id_config_practica: number) {
        const req = new HttpRequest('DELETE', `${environment.url_back}/solicitud_documento/eliminar_config?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    getPracticasConConfig(id_config_practica: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/practica/configs?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    actualizarEstudiantes(id_estudiante: number, id_config: number) {
        const payload = {
            id: id_estudiante,
            id_config_practica: id_config
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/estudiante/actualizarConfig`, payload, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    obtener_config_practica_carrera(id_carrera: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/config_practica/carrera?id_carrera=${id_carrera}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    obtener_practicas_config_practica(id_config_practica: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/practica/configs?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }
    getConfigsCarrera(id_carrera: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/config_practica/all/carrera?id=${id_carrera}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

}