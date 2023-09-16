import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class RamosService {
    constructor(private _http: HttpClient) { }

    getRamos() {
        const req = new HttpRequest('GET', `${environment.url_back}/ramo`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    getModalidades(id_config_practica: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/modalidad/id_config_practica?id=${id_config_practica}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }
    
    crearModalidad(id_config_practica: number, modalidad: string, cantidad_tiempo: number) {
        const config = {
            id_config_practica: id_config_practica,
            tipo_modalidad: modalidad,
            cantidad_tiempo: cantidad_tiempo
        }

        const req = new HttpRequest('POST', `${environment.url_back}/modalidad/crear`, config, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    actualizarModalidad(id_config_practica: number, modalidad: string, cantidad_tiempo: number) {
        const config = {
            id_config_practica: id_config_practica,
            tipo_modalidad: modalidad,
            cantidad_tiempo: cantidad_tiempo
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/modalidad/actualizar`, config, {
            responseType: 'json'
        });

        return this._http.request(req);
    }
}
