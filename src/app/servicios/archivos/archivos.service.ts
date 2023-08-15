import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filetypename } from 'magic-bytes.js'
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

  hayInterseccion(a: string[], b: string[]): boolean {
    for (let i = 0; i < a.length; i++) {
      if (b.includes(a[i]))
        return true;
    }
    return false;
  }

  async checkFileType(file: File, type: string[], slicing: number = 100): Promise<boolean> {
    if (!file || !type || type.length == 0) return false;

    let _filename = file.name.toLowerCase();
    // obtiene la extensión teniendo en cuenta que el nombre del archivo puede no tener puntos o partir con puntos
    let file_ext = _filename.slice((_filename.lastIndexOf(".") - 1 >>> 0) + 2)
    let _types = type.map((t: string) => t.toLowerCase());
    if (!_types.includes(file_ext)) return false;

    let blob = file.slice(0, slicing);
    let data = new Uint8Array(await blob.arrayBuffer());
    return this.hayInterseccion(filetypename(data), _types);
  }

  subirDocExtra(file: File, id_documento_extra: number): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('id_documento_extra', `${id_documento_extra}`);

    const req = new HttpRequest('PUT', `${environment.url_back}/${environment.ruta_documento_extra}/agregar_documento`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this._http.request(req);
  }
}
