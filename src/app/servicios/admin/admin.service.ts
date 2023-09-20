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
    const req = new HttpRequest('POST',`${this.url}/carrera/crear-carrera`,{nombre});
    return this.http.request(req);
  }

  crearEncargado(email: string){
    const req = new HttpRequest('POST',`${this.url}/encargado/crear-encargado`,{email});
    return this.http.request(req);
  }

  asignarEncargado(nombre: string, carrera: string){
    const req = new HttpRequest('POST',`${this.url}/admin/asignar-encargado`,{nombre, carrera});
    return this.http.request(req);
  }
}
