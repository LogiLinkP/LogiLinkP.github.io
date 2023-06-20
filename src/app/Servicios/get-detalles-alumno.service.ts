import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GetDetallesAlumnoService {
  url: string = 'http://localhost:3000/estudiante/todos';
  alumnos: any = [
    { Id: '1', Nombre: 'Marcelo', Apellido: 'Cabezas', rut: '19916087-7', Practica_1: 'Solicitada Revisión', Practica_2: 'No Cursada' },
    { Id: '2', Nombre: 'Joaquín', Apellido: 'De Ferrari', rut: '12345678-9', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
    { Id: '3', Nombre: 'Rodrigo', Apellido: 'Tallar', rut: '9-87654321', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
    { Id: '4', Nombre: 'Diego', Apellido: 'Beltrán', rut: '13579246-8', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
    { Id: '5', Nombre: 'Harold', Apellido: 'Caballero', rut: '24681035-7', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
    { Id: '6', Nombre: 'Vicente', Apellido: 'Balbontín', rut: '11235813-2', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
  ];
  constructor(private _http: HttpClient) { }

  full_estudiante_practicas() {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/estudiantes_practicas`);
    return this._http.request(req);
  }

  get_alumnos2() {
    return this._http.get(this.url);
  }
  get_alumno(x: number) {
    return this.alumnos[x];
  }

}
