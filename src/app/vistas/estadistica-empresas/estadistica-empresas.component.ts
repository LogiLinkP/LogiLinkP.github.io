import { HttpClient, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmpresaService } from '../../servicios/empresa/empresa.service';

import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common'
import { DocumentosService } from '../../servicios/encargado/documentos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { environment } from 'src/environments/environment';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

export interface DialogData {
  //formatos: Formato[];
  nombre_empresa: string;
  lista_comentarios: any[];
  palabras_clave: string[];
}


@Component({
  selector: 'app-estadistica-empresas',
  templateUrl: './estadistica-empresas.component.html',
  styleUrls: ['./estadistica-empresas.component.scss']
})

export class EstadisticaEmpresasComponent {

  constructor(public dialog: MatDialog, private _http: HttpClient, private _router: Router, private empresaService: EmpresaService) { }

  closeResult = '';

  empresas: any[] = [];

  practicas: any[] = [];

  comentarios: any[][] = [];

  comentarios_empresa: any[] = [];

  palabras_clave_una_empresa: string[] = [];

  palabras_clave_empresa: string[] = [];

  nombre_empresa_comentario = "";



  texto_explicaion= " Esto indica el porcentaje de alumnos\n que realizaron su práctica en esta empresa\n y luego, llegaron a trabajar en una gran empresa"

  

  ngOnInit(): void {

    let respuesta: any = {};

    this.empresaService.obtener_empresas().subscribe({
      next: data => {
        //console.log(data);
        respuesta = { ...respuesta, ...data }
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        //console.log("respuesta empresas:");
        //console.log(respuesta.body);
        this.empresas = respuesta.body;
        //console.log(this.empresas);

        //recorrer empresas y obtener practicas por id de empresa

        //TERMINAR REQUEST PRACTICA POR ID EMPRESA

        let comentarios_desordenados: any[][] = [];

        //crear arreglo para insertar ahi los comentarios de cada empresa
        for (let i = 0;i<this.empresas.length;i++){
          comentarios_desordenados.push([]);
        }

        for (let i = 0; i < this.empresas.length; i++){
          console.log("empresa: ", this.empresas[i].nombre_empresa);
          console.log("palabras clave: ", this.empresas[i].palabras_clave);
          this.palabras_clave_empresa.push(this.empresas[i].palabras_clave);
          this.empresaService.obtener_practicas_por_empresa(this.empresas[i].id).subscribe({
            next: data => {
              //console.log(data);
              respuesta = { ...respuesta, ...data }
            },
            error: error => {
              console.log(error);
            },
            complete: () => {
              let practica_aux = [];
              //console.log("respuesta practicas:");
              //console.log("practicas en empresa " + this.empresas[i].nombre_empresa);
              //console.log(respuesta.body);
              practica_aux = respuesta.body;
              let comentarios_aux = [];
              //comentarios_aux.push(this.empresas[i].id);
              for (let j = 0; j < practica_aux.length; j++){
                comentarios_aux.push(practica_aux[j].comentario_empresa);
              }
              comentarios_desordenados[i] = comentarios_aux;
              //let eliminar = comentarios_desordenados[i].shift();
              //omentarios_desordenados.push(comentarios_aux);
            }
          })
        }
        /*
        console.log("comentarios desordenados:");
        console.log(comentarios_desordenados);
        for (let i = 0; i < comentarios_desordenados.length; i++){
          console.log(comentarios_desordenados[i]);
          let eliminar = comentarios_desordenados[i].shift() ;
        }
        */

        //console.log("comentarios desordenados shift:");
        //console.log(comentarios_desordenados);


        this.comentarios = comentarios_desordenados;
        

        //console.log("empresas:");
        //console.log(this.empresas);

        console.log("comentarios:");
        console.log(this.comentarios);
      }
    })
  }

  cant_not_null(array: any[]){
    let cant = 0;
    for (let i = 0; i < array.length; i++){
      if (array[i] != null){
        cant++;
      }
    }
    return cant;
  }

  cant_estrellas_completas(calificacion: number){
    let cant = 0
    if (calificacion == null){
      return 0;
    }
    else if (calificacion < 1){
      return 0;
    }
    else if (calificacion < 2){
      return 1;
    }
    else if (calificacion < 3){
      return 2;
    }
    else if (calificacion < 4){
      return 3;
    }
    else if (calificacion < 5){
      return 4;
    }
    else if (calificacion == 5){
      return 5;
    }
    else{
      return 0;
    }
  }

  media_estrella(calificacion: number){
    if (calificacion == null){
      return false;
    }
    let decimal = calificacion - Math.floor(calificacion);
    if (decimal < 0.5){
      return false;
    }
    else{
      return true;
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, id_empresa: number): void {
    for (let i = 0; i < this.empresas.length; i++){
      if (this.empresas[i].id == id_empresa){

        this.comentarios_empresa = this.comentarios[i];
        this.nombre_empresa_comentario = this.empresas[i].nombre_empresa;
        if (this.palabras_clave_empresa[i]){
          this.palabras_clave_una_empresa = this.palabras_clave_empresa[i].split(',');
        }
        else{
          this.palabras_clave_una_empresa = [];
        }
        //this.comentarios_empresa.splice(0, 1);
        //this.comentarios_empresa.shift();
        break;
      }
    }
    //this.comentarios_empresa.shift();

    const dialogRef = this.dialog.open(Dialog, {
      width: '800px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {nombre_empresa: this.nombre_empresa_comentario, lista_comentarios: this.comentarios_empresa, palabras_clave: this.palabras_clave_una_empresa}
    });

  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, CommonModule,
    NgFor],
})
export class Dialog {
  //nombre: string;
  //descripcion: string;
  //formato: string[];
  lista_comentarios: any[] = [];
  nombre_empresa: string;
  palabras_clave: string[];
  

  constructor(public dialogRef: MatDialogRef<Dialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}