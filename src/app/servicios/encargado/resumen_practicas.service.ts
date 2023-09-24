import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GetDetallesAlumnoService {

  constructor(private _http: HttpClient) { }
  
  full_estudiante_practicas(id_carrera:number) {
    const req = new HttpRequest('GET', `${environment.url_back}/practica/estudiantes_practicas`, {id_carrera});
    return this._http.request(req);
  }

}
