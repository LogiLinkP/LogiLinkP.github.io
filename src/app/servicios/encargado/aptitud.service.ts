import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest } from "@angular/common/http";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AptitudService {

  url = environment.url_back;

  constructor(private http: HttpClient) { }

  crearAptitud(id_carrera: number, lista: any){
    const req = new HttpRequest('POST',`${this.url}/encargado/crear-aptitud`,{id_carrera, lista});
    return this.http.request(req);
  }

  editarAptitud(id: number, id_carrera: number, nombre: string){
    const req = new HttpRequest('POST',`${this.url}/encargado/editar-aptitud`,{id, id_carrera, nombre});
    return this.http.request(req);
  }

  eliminarAptitud(id: number){
    const req = new HttpRequest('POST',`${this.url}/encargado/eliminar-aptitud`,{id});
    return this.http.request(req);
  }

  getAptitudes(id_carrera: number){
    const req = new HttpRequest('POST',`${this.url}/encargado/todos-aptitudes`,{id_carrera});
    return this.http.request(req);
  }

  actualizarRango(id_carrera: number, rango: number){
    const req = new HttpRequest('POST',`${this.url}/encargado/rango`,{id_carrera, rango});
    return this.http.request(req);
  }

  getRango(id_carrera: number){
    const req = new HttpRequest('POST',`${this.url}/encargado/get-rango`,{id_carrera});
    return this.http.request(req);
  }

  ifAptitudes(id_carrera: number){
    const req = new HttpRequest('POST',`${this.url}/encargado/if-aptitudes`,{id_carrera});
    return this.http.request(req);
  }
}
