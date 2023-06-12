import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetDetallesAlumnoService {
  private alumnos: any = [
    { Id: '1', Nombre: 'Marcelo', Apellido: 'Cabezas', rut: '19916087-7', Practica_1: 'En desarrollo', Practica_2: 'No Cursado'},
    { Id: '2',Nombre: 'Joaquín', Apellido: 'De Ferrari', rut: '12345678-9', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
    { Id: '3',Nombre: 'Rodrigo', Apellido: 'Tallar', rut: '9-87654321', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
    { Id: '4',Nombre: 'Diego', Apellido: 'Beltrán', rut: '13579246-8', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
    { Id: '5',Nombre: 'Harold', Apellido: 'Caballero', rut: '24681035-7', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
    { Id: '6',Nombre: 'Vicente', Apellido: 'Balbontín', rut: '11235813-2', Practica_1: 'Aprobado', Practica_2: 'Aprobado' },
  ]; 
  constructor() { }

  get_alumnos(){
    return this.alumnos;
  }
  get_alumno(x: number){
    return this.alumnos[x];
  }

}
