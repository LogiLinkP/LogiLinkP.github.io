import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class RamosService {
    constructor(private _http: HttpClient) { }

    getRamos(id: number) {
        const req = new HttpRequest('GET', `${environment.url_back}/carrera?id=${id}`, {
            responseType: 'json'
        });

        return this._http.request(req);
    }

    actualizarRamos(id: number, ramos: string) {
        const payload = {
            id: id,
            ramos: ramos
        }

        const req = new HttpRequest('PUT', `${environment.url_back}/carrera/actualizar`, payload, {
            responseType: 'json'
        });

        return this._http.request(req);
    }
}
