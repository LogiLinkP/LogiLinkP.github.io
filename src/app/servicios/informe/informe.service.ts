import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InformeService {

  constructor(private http: HttpClient) { }

  get_informe_preguntas(id_informe: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/${environment.ruta_informe}/preguntas?id=${id_informe}`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
