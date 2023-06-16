import { Injectable } from '@angular/core';
import { GetDetallesAlumnoService } from './get-detalles-alumno.service';

@Injectable({
  providedIn: 'root'
})
export class SetDetallesAlumnoService {

  constructor(private service: GetDetallesAlumnoService) { }

  registrar_practica(id: number, n: number){
    if (n == 1) {
      this.service.alumnos[id-1].Practica_1 = "En Desarrollo";
    }
    else{
      if (n == 2) {
        this.service.alumnos[id-1].Practica_2 = "En Desarrollo";
      }
    }
  }

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

  finalizar_practica(id:number,n:number){
    if (n == 1) {
      this.service.alumnos[id-1].Practica_1 = "Revisión Solicitada";
    }
    else{
      if (n == 2) {
        this.service.alumnos[id-1].Practica_2 = "Revisión Solicitada";
      }
    }
  }
}