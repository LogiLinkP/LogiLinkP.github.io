import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest } from "@angular/common/http";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url = environment.url_back;

  constructor(private http: HttpClient) { }

  crearCarrera(nombre: string){
    const req = new HttpRequest('POST',`${this.url}/carrera/crear`,{nombre});
    return this.http.request(req);
  }

  crearEncargado(email: string){
    const req = new HttpRequest('POST',`${this.url}/usuario/crear-encargado`,{email});
    return this.http.request(req);
  }
}
