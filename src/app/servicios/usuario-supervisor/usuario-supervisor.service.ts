import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest } from "@angular/common/http";
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSupervisorService {

  url_back = environment.url_back;

  constructor(private http: HttpClient) { }

  buscar_estudiantes(id_usuario: number){
    const req = new HttpRequest('POST',`${this.url_back}/usuario/estudiantes_revisados`,{id_usuario});
    return this.http.request(req);
  }

}
