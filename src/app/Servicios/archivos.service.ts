import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(private _http:HttpClient) { }

  ploadExcel(file:File): Observable<any>{
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `http://127.0.0.1/file/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this._http.request(req);
  }
}
