import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest } from "@angular/common/http";
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = environment.url_back;

  constructor(private http: HttpClient, private cookies: CookieService) { }

  login(email: string, password: string): Observable<any>{
    const req = new HttpRequest('POST',`${this.url}/usuario/login`,{email,password});
    return this.http.request(req);
  }

  register(email: string, password: string, cnfPwd: string ,nombre: string, es_encargado: boolean, es_supervisor: boolean, es_estudiante: boolean, es_admin: boolean, extras: any): Observable<any>{
    const req = new HttpRequest('POST',`${this.url}/usuario/register`,{email,password,cnfPwd,nombre,es_encargado,es_supervisor,es_estudiante,es_admin,extras});
    return this.http.request(req);
  }

  logout(): Observable<any>{
    const req = new HttpRequest('POST',`${this.url}/usuario/logout`, { });
    return this.http.request(req);
  }

}
