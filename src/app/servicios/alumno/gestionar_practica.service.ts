import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GestionarService {

  constructor(private http: HttpClient) { }

  registrar_empresa(nombre_empresa: string, rut_empresa: string) {
    const nueva_empresa = {
      nombre_empresa: nombre_empresa,
      rut_empresa: rut_empresa,
      empresa_verificada: false,
      dominios_empresa: ""
    }
    const req = new HttpRequest('POST', `${environment.url_back}/empresa/crear`, nueva_empresa, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  get_empresa_por_rut(rut: string) {
    const req = new HttpRequest('GET', `${environment.url_back}/empresa/por_rut?rut=${rut}`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  registrar_supervisor(nombre_supervisor: string, correo_supervisor: string) {
    const nuevo_supervisor = {
      id_usuario: null,
      nombre: nombre_supervisor,
      correo: correo_supervisor,
      carnet_rostro: false,
      es_correo_institucional: false
    }
    const req = new HttpRequest('POST', `${environment.url_back}/supervisor/crear`, nuevo_supervisor, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  registrar_practica(id_estudiante: number, id_modalidad: number, fecha_inicio: string,
    id_empresa: number, id_supervisor: number, id_encargado: number, id_config_practica: number) {

    const nueva_practica = {
      estado: environment.estado_practica.en_curso,
      id_estudiante: id_estudiante,
      id_modalidad: id_modalidad,
      fecha_inicio: fecha_inicio,
      horas: 0,
      id_empresa: id_empresa,
      id_supervisor: id_supervisor,
      id_encargado: id_encargado,
      id_config_practica
    }
    const req = new HttpRequest('POST', `${environment.url_back}/practica/crear`, nueva_practica, {
      responseType: 'text'
    });
    return this.http.request(req);
  }

  finalizar_practica(id_estudiante: number, id_practica: number, estado: string, correo: string, nom_estudiante: string) {
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/finalizar`, {
      id_estudiante, id_practica, estado, correo, nom_estudiante
    }, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  buscar_config_practica(nombre: string, id_carrera: number) {
    console.log("Buscando configuracion de practica con nombre: ", nombre)
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/nombre?nombre=${nombre}&id_carrera=${id_carrera}`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  //buscar modalidad en base a id_config_practica, tipo_modalidad y cantidad_tiempo
  buscar_modalidad(id_config_practica: number, tipo_modalidad: string, cantidad_tiempo: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/modalidad/buscar?id_config_practica=${id_config_practica}&tipo_modalidad=${tipo_modalidad}&cantidad_tiempo=${cantidad_tiempo}`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  buscar_encargados() {
    const req = new HttpRequest('GET', `${environment.url_back}/encargado/todos`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  subir_informe(id_informe: number, key: Object, file_informe: File) {
    const formData:FormData = new FormData();
    formData.append('id', id_informe.toString());
    formData.append('key', JSON.stringify(key));
    formData.append('file_informe', file_informe);
    const req = new HttpRequest('PUT', `${environment.url_back}/informe/subirInforme`, formData, {responseType:"json"});
    return this.http.request(req);
  }
}


