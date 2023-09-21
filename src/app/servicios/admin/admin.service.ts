import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest } from "@angular/common/http";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url = environment.url_back;

  constructor(private http: HttpClient) { }

  crearCarrera(lista: any){
    const req = new HttpRequest('POST',`${this.url}/carrera/crear-carrera`,{lista});
    return this.http.request(req);
  }

  crearEncargado(email: string){
    const req = new HttpRequest('POST',`${this.url}/encargado/crear-encargado`,{email});
    return this.http.request(req);
  }

  getCarrera(){
    const req = new HttpRequest('GET',`${this.url}/carrera/todos`);
    return this.http.request(req);
  }

  getEncargado(){
    const req = new HttpRequest('GET',`${this.url}/encargado/todos`);
    return this.http.request(req);
  }

  asignarEncargado(pares: any){
    const req = new HttpRequest('POST',`${this.url}/admin/asignar-encargado`,{pares});
    return this.http.request(req);
  }
}
