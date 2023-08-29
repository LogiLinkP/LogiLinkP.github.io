import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumenService {

  constructor(private http: HttpClient) { }

  get_informe_preguntas(id_practica: number) {
    const req = new HttpRequest('POST', `${environment.url_back}/practica/resumen?id_practica=${id_practica}`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
