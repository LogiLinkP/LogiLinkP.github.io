import { Injectable } from '@angular/core';
import { GetDetallesAlumnoService } from './resumen_practicas.service';

@Injectable({
  providedIn: 'root'
})
export class SetDetallesAlumnoService {

  constructor(private service: GetDetallesAlumnoService) { }

  aprobar_practica(id: number, n: number){
    if (n == 1) {
      this.service.alumnos[id-1].Practica_1 = "Aprobada";
    }
    else{
      if (n == 2) {
        this.service.alumnos[id-1].Practica_2 = "Aprobada";
      }
    }
  }

  reprobar_practica(id: number, n: number){
    if (n == 1) {
      this.service.alumnos[id-1].Practica_1 = "Aprobada";
    }
    else{
      if (n == 2) {
        this.service.alumnos[id-1].Practica_2 = "Aprobada";
      }
    }
  }
}