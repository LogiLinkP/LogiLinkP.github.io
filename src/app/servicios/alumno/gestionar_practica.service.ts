import { Injectable } from '@angular/core';
import { GetDetallesAlumnoService } from '../encargado/resumen_practicas.service';

@Injectable({
  providedIn: 'root'
})
export class GestionarService {

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
