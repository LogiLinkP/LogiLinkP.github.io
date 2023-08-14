import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  PATH_DOC_EXTRA = "documento_extra";
  constructor(private _http: HttpClient) { }

  solicitar_documento_extra(datos: any) {
    const req = new HttpRequest('POST', `${environment.url_back}/${this.PATH_DOC_EXTRA}/crear`, datos);
    return this._http.request(req);
  }
}
