import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotisChatService {

  constructor(private _http: HttpClient) { }

  postchat(){
    const req = new HttpRequest('POST', `${environment.url_back}/estudiante?id=${id}`);
    return this._http.request(req);
  }

  getchat(){
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante?id=${id}`);
    return this._http.request(req);
  }


  postmensaje(){
    const req = new HttpRequest('POST', `${environment.url_back}/estudiante?id=${id}`);
    return this._http.request(req);
  }

  getmensaje(){
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante?id=${id}`);
    return this._http.request(req);
  }

  
  postnoti(){
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante?id=${id}`);
    return this._http.request(req);
  }

  getnoti(){
    const req = new HttpRequest('GET', `${environment.url_back}/estudiante?id=${id}`);
    return this._http.request(req);
  }

  deletenoti(){
    const req = new HttpRequest('DELETE', `${environment.url_back}/estudiante?id=${id}`);
    return this._http.request(req);
  }


}