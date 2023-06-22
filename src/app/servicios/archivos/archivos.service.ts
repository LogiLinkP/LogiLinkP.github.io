import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(private _http: HttpClient) { }

  uploadFile(file: File, id_estudiante: number): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('id_estudiante', `${id_estudiante}`);

    const req = new HttpRequest('POST', `${environment.url_back}/documento/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this._http.request(req);
  }
}
