import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Obj } from '@popperjs/core';

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

  get_pregunta_informe(id_pregunta: number) {
    const req = new HttpRequest('GET', `${environment.url_back}/pregunta_informe?id=${id_pregunta}`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  update_key_informe(id: number, key: Object) {
    const req = new HttpRequest('PUT', `${environment.url_back}/${environment.ruta_informe}/actualizar`, { id, key }, {
      responseType: 'text'
    });
    return this.http.request(req);
  }
}
