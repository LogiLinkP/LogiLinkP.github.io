import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class EdicionService {

  	constructor(private _http: HttpClient) { }

	actualizarConfigPractica(id: number, nombre: string, frec: string, final: string) {
    	const payload = {
			id: id,
			nombre: nombre,
			frecuencia_informes: frec,
			informe_final: final
		}

    	const req = new HttpRequest('PUT', `${environment.url_back}/config_practica/actualizar`, payload, {
        	responseType: 'json'
    	});

    	return this._http.request(req);
    }

	getConfigsConPractica(id_config_practica: number){
		const req = new HttpRequest('GET', `${environment.url_back}/config_practica/configConPractica?id=${id_config_practica}`, {
            responseType: 'json'
        });
		
        return this._http.request(req);
    }

}
