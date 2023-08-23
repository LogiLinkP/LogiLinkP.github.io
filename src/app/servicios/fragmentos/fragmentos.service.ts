import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FragmentosService {

  constructor(private http: HttpClient) { }

  get_fragmentos_practica(id_practica: number, cantidad: number = 10) {

    const req = new HttpRequest('GET', `${environment.url_back}/similitud/frases_representativas_practica/${id_practica}?cantidad=${cantidad}`, {
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
