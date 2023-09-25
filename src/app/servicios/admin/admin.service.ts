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

  asignarEncargado(id_encargado: any, id_carrera: any){
    const req = new HttpRequest('POST',`${this.url}/admin/asignar-encargado`,{id_encargado, id_carrera});
    return this.http.request(req);
  }

  eliminarEncargado(id: any){
    const req = new HttpRequest('POST',`${this.url}/admin/eliminar-encargado`,{id});
    return this.http.request(req);
  }

  getEncargadoCarrera(id: any){
    const req = new HttpRequest('GET',`${this.url}/admin/todos-encargados-carreras?id=${id}`);
    return this.http.request(req);
  }

  editarCarrera(id_carrera: any, nombre: any, correos_admitidos: any){
    const req = new HttpRequest('POST',`${this.url}/admin/editar-carrera`,{id_carrera, nombre, correos_admitidos});
    return this.http.request(req);
  }

  eliminarCarrera(id: any){
    const req = new HttpRequest('POST',`${this.url}/admin/eliminar-carrera`,{id});
    return this.http.request(req);
  }
}
