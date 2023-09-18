import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GestionarService {

  constructor(private http: HttpClient) { }

  registrar_empresa(nombre_empresa: string, rut_empresa: string) {
    console.log("Registrando empresa con nombre: ", nombre_empresa, " y rut: ", rut_empresa)
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
    console.log("Finalizando practica con id: ", id_practica, " y estado: ", estado, " para estudiante con id: ", id_estudiante)
    const req = new HttpRequest('PUT', `${environment.url_back}/practica/finalizar`, {
      id_estudiante, id_practica, estado, correo, nom_estudiante
    }, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  buscar_config_practica(nombre: string, activada: boolean = true) {
    console.log("Buscando configuracion de practica con nombre: ", nombre)
    const req = new HttpRequest('GET', `${environment.url_back}/config_practica/buscar?nombre=${nombre}&activada=${activada}`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  //buscar modalidad en base a id_config_practica, tipo_modalidad y cantidad_tiempo
  buscar_modalidad(id_config_practica: number, tipo_modalidad: string, cantidad_tiempo: number) {
    console.log("Buscando modalidad con id_config_practica: ", id_config_practica, " tipo_modalidad: ", tipo_modalidad, " y cantidad_tiempo: ", cantidad_tiempo)
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
}
