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
    const req = new HttpRequest('POST',`${this.url}`,{email,password});
    return this.http.request(req);
  }

  register(nombre: string, email:string, password: string, confirmPassword: string, tipo: number): Observable<any>{
    const req = new HttpRequest('POST',`${this.url}`,{nombre, email, password,confirmPassword, tipo});
    return this.http.request(req);
  }

  logout(): Observable<any>{
    const req = new HttpRequest('POST',`${this.url}`, { });
    return this.http.request(req);
  }

  setToken(token: string) {
    this.cookies.set("token", token);
  }

  getToken() {
    return this.cookies.get("token");
  }
}
