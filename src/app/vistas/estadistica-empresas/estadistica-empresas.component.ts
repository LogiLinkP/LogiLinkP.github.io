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
import { ObtenerDatosService } from '../../servicios/alumno/obtener_datos.service';
import e from 'express';

export interface DialogData {
  //formatos: Formato[];
  nombre_empresa: string;
  lista_comentarios: any[];
  palabras_clave: string[];
  tipo: string;
  nombre_ramos_utiles: string[];
  porcentaje_ramos_utiles: number[];
}

@Component({
  selector: 'app-estadistica-empresas',
  templateUrl: './estadistica-empresas.component.html',
  styleUrls: ['./estadistica-empresas.component.scss']
})

export class EstadisticaEmpresasComponent {

  constructor(public dialog: MatDialog, private _http: HttpClient, private _router: Router, private empresaService: EmpresaService, private datosService: ObtenerDatosService) { }

  sesion: any = JSON.parse(localStorage.getItem("auth-user") || "{}")

  closeResult = '';
  empresas: any[] = [];
  ramos_empresas: any[] = [];
  practicas: any[] = [];
  comentarios: any[][] = [];
  comentarios_empresa: any[] = [];
  palabras_clave_una_empresa: string[] = [];
  palabras_clave_empresa: string[] = [];
  nombre_empresa_comentario = "";
  texto_explicaion= " Esto indica el porcentaje de alumnos\n que realizaron su práctica en esta empresa\n y luego, llegaron a trabajar en una gran empresa"
  empresas_no_encontradas = false;

  id_carrera_estudiante = 0;

  ngOnInit(): void {

    let id_usuario = this.sesion.userdata.id;

    //console.log("id usuario: ", id_usuario);

    let respuesta: any = {};

    //obteniendo estudiante segun id_usuario
    this.datosService.obtener_estudiante(id_usuario).subscribe({
      next: data => {
        //console.log(data);
        respuesta = { ...respuesta, ...data }
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        //console.log("respuesta estudiante:");
        //console.log(respuesta.body);
        this.id_carrera_estudiante = respuesta.body.id_carrera;
        //console.log("id carrera estudiante: ", this.id_carrera_estudiante);   

        this.empresaService.obtener_empresas().subscribe({
          next: data => {
            //console.log(data);
            respuesta = { ...respuesta, ...data }
          },
          error: error => {
            console.log(error);
            if (error.status == 404) {
                this.empresas_no_encontradas = true;
            }
          },
          complete: () => {
            //console.log("respuesta empresas:");
            //console.log(respuesta.body);
            this.empresas = respuesta.body;
            //console.log(this.empresas);

            //dejando calificaciones con 1 decimal
            for (let i = 0; i < this.empresas.length; i++){

              if (this.empresas[i].ramos_utiles == null){
                this.ramos_empresas.push(this.empresas[i].ramos_utiles);
              }
              else{
                //console.log("hay ramos en la empresa");
                let ramos_carrera_empresa = this.empresas[i].ramos_utiles[this.id_carrera_estudiante];
                //console.log("ramos carrera empresa: ", ramos_carrera_empresa);
                if (ramos_carrera_empresa != null){
                  //console.log("ramos carrera empresa no es null");
                  this.ramos_empresas.push(ramos_carrera_empresa);
                }
                else{
                  this.ramos_empresas.push(null);
                }
              }

              if (this.empresas[i].calificacion_promedio != null){
                this.empresas[i].calificacion_promedio = Number(this.empresas[i].calificacion_promedio.toFixed(1));
              }
            }

            //console.log("ramos empresas: ", this.ramos_empresas);

            

            let comentarios_desordenados: any[][] = [];

            //crear arreglo para insertar ahi los comentarios de cada empresa
            for (let i = 0;i<this.empresas.length;i++){
              comentarios_desordenados.push([]);
            }

            for (let i = 0; i < this.empresas.length; i++){
              //console.log("empresa: ", this.empresas[i].nombre_empresa);
              //console.log("palabras clave: ", this.empresas[i].palabras_clave);
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

            this.comentarios = comentarios_desordenados;
            
            //console.log("empresas:");
            //console.log(this.empresas);

            //console.log("comentarios:");
            //console.log(this.comentarios);
          }
        })
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, id_empresa: number, tipo_dialog: string): void {

    let ramos_utiles_aux: any[] = [];
    let nombre_ramos_utiles: string[] = [];
    let porcentaje_ramos_utiles: number[] = [];

    for (let i = 0; i < this.empresas.length; i++){
      if (this.empresas[i].id == id_empresa){

        let ramos_utiles_aux = this.ramos_empresas[i];

        if(ramos_utiles_aux != null){
          for(let k=0; k<ramos_utiles_aux.length;k++){
            //si en number push porcentaje
             if(typeof ramos_utiles_aux[k] == 'number'){
               porcentaje_ramos_utiles.push(ramos_utiles_aux[k]);
             }
             else{
               nombre_ramos_utiles.push(ramos_utiles_aux[k]);
             } 
           }
        }
        
        //console.log("ramos utiles aux: ", ramos_utiles_aux);
        //console.log("nombre ramos utiles: ", nombre_ramos_utiles);
        //console.log("porcentaje ramos utiles: ", porcentaje_ramos_utiles);

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

    //let pos_empresa = this.empresas.indexOf()

    //this.comentarios_empresa.shift();

    const dialogRef = this.dialog.open(Dialog, {
      width: '800px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {nombre_empresa: this.nombre_empresa_comentario, lista_comentarios: this.comentarios_empresa, palabras_clave: this.palabras_clave_una_empresa, tipo: tipo_dialog, nombre_ramos_utiles: nombre_ramos_utiles, porcentaje_ramos_utiles: porcentaje_ramos_utiles}
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
  tipo: string;
  nombre_ramos_utiles: string[];
  porcentaje_ramos_utiles: number[];
  

  constructor(public dialogRef: MatDialogRef<Dialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}