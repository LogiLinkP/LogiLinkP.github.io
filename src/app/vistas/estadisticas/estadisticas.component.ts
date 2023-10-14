import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs';

import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';

import { PreguntasEncuestaFinalService } from 'src/app/servicios/alumno/preguntas-encuesta-final.service';
import { EstadisticasService } from 'src/app/servicios/estadisticas/estadisticas.service';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { data } from 'jquery';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import { CarreraService } from 'src/app/servicios/carrera/carrera.service';
import { EmpresaService } from 'src/app/servicios/empresa/empresa.service';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
})
export class EstadisticasComponent {
  constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef, @Inject(DOCUMENT) private document: Document, private router: Router, private serviceUsuario: DataUsuarioService,
  private serviceBarra: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute, private serviceConfig: ConfigService, private serviceCarrera: CarreraService,
  private serviceEmpresa: EmpresaService , private servicePreguntas: PreguntasEncuestaFinalService, private _snackbar: MatSnackBar, private serviceEstadisticas : EstadisticasService) {}

  sesion: any = JSON.parse(localStorage.getItem("auth-user") || "{}")


  id_config_practica_mostrar = 0; //va a ir cambiando con una funcion
  preguntas_mostrar: any[][] = []; //arreglo varia segun id_config_practica_mostrar

  AUX_config_practicas: any[] = [];
  AUX_respuestas_encuestas: any[] = [];
  AUX_preguntas_encuestas: any[] = [];

  //preguntas_por_config_practica: any[][] = [];
  //respuestas_por_pregunta: any[][] = [];

  preguntas_abiertas_respuestas: any[][] = [];
  preguntas_casillas_alternativas_respuestas: any[][] = [];

  preguntas_estadisticas_AUX: any[] = [];
  preguntas_estadisticas: any[][] = [];

  dia_actualizacion_DB = 0;

  vista_actual = "general";

  //remuneracion
  remuneracion_tipo_practica: any[] = [];
  remuneracion_promedio_tipo_practica: number = 0;

  remuneracion_por_carrera: any[] = [];
  remuneracion_promedio_por_carrera: number = 0;

  remuneracion_por_empresa: any[] = [];
  remuneracion_promedio_por_empresa: number = 0;

  remuneracion_por_ramo_util: any[] = [];
  remuneracion_promedio_por_ramo_util: number = 0;

  //generales

  alumnos_practica_nombre: string[] = [];
  alumnos_cursando_practica_cantidad: number[] = [];
  alumnos_practica_finalizada_cantidad: number[] = [];

  total_alumnos_finalizada_practica_cantidad = 0;
  total_alumnos_cursando_practica_cantidad = 0;

  //ramos
  arreglo_ramos: any[] = [];

  ramos: string[] = [];
  porcentajes: number[] = [];

  ramos_top5: string[] = [];
  porcentajes_top5: number[] = [];

  arreglo_ramos_top5: any[] = [];

  //valoracion_empresas
  nombre_empresas: string[] = [];
  valoracion_empresas: number[] = [];

  nombre_empresas_top5: string[] = [];
  valoracion_empresas_top5: number[] = [];


  top5_empresas: any[] = [];
  top5_aptitudes: any[] = [];

  id_carrera_encargado = 0;

  ngOnInit(): void {

    let id_usuario = this.sesion.userdata.id;

    //console.log("id_usuario: ", id_usuario);
    
    let respuesta: any = {};

    this.serviceUsuario.obtener_encargado(id_usuario).subscribe({
      next: data => {
        //console.log(data);
        respuesta = { ...respuesta, ...data };
      },
      error: error => {
        console.log(error);
      },
      complete: () => {

        this.id_carrera_encargado = respuesta.body.id_carrera;

        //------------- ESTADISTIOCAS RAMOS ----------------

        this.serviceCarrera.obtener_carrera(respuesta.body.id_carrera).subscribe({
          next: data => {
            //console.log(data);
            respuesta = { ...respuesta, ...data };
          },
          error: error => {
            console.log(error);
          },
          complete: () => {
            
            this.arreglo_ramos = respuesta.body.estadistica_ramos.array[0];

            for (let i = 0; i < this.arreglo_ramos.length; i++) {
              if (this.isNumber(this.arreglo_ramos[i])) {
                this.porcentajes.push(Number(this.arreglo_ramos[i]));
              }
              else{
                this.ramos.push(String(this.arreglo_ramos[i]));
              }
            }

            for (let i = 0; i < this.ramos.length; i++) {
              this.ramos_top5.push(this.ramos[i]);
              this.porcentajes_top5.push(this.porcentajes[i]);
            }
        
            //ordenar porcentaje de mayor a menor
            for (let i = 0; i < this.porcentajes_top5.length; i++) {
              for (let k = 0; k < this.porcentajes_top5.length; k++) {
                if (this.porcentajes_top5[i] > this.porcentajes_top5[k]) {
                  let aux = this.porcentajes_top5[i];
                  this.porcentajes_top5[i] = this.porcentajes_top5[k];
                  this.porcentajes_top5[k] = aux;
        
                  let aux2 = this.ramos_top5[i];
                  this.ramos_top5[i] = this.ramos_top5[k];
                  this.ramos_top5[k] = aux2;
                }
              }
            }

            for (let i = 0; i < 5; i++) {
              if (this.ramos_top5[i] != undefined) {
                //this.ramos_top5[i] = " ";
                this.arreglo_ramos_top5.push(this.ramos_top5[i]);
                this.arreglo_ramos_top5.push(this.porcentajes_top5[i]);
              }
            }
        
            this.arreglo_ramos = this.arreglo_ramos_top5;

            //console.log("Arreglo top 5: ");
            //console.log(this.arreglo_ramos);
        
          }
        });
        //------------ FIN ESTADISTICAS RAMOS --------------


        //obteniendo datos remuneracion por tipo de practica

        this.serviceConfig.obtener_config_practica_carrera(respuesta.body.id_carrera).subscribe({
          next: data => {
            //console.log(data);
            respuesta = { ...respuesta, ...data };
          },
          error: error => {
            console.log(error);
          },
          complete: () => {

            //console.log("config_practica_carrera: ", respuesta.body);
            this.AUX_config_practicas = respuesta.body;

            //obteniendo datos remuneracion por tipo de practica
            let cantidad_tipos_practicas_remuneracion=0;
            for (let i=0; i<this.AUX_config_practicas.length; i++) {

              this.alumnos_practica_nombre.push(this.AUX_config_practicas[i].nombre);
              this.alumnos_cursando_practica_cantidad.push(0);
              this.alumnos_practica_finalizada_cantidad.push(0);
            }

            for (let i=0; i<this.AUX_config_practicas.length; i++) {

              //let aux_cantidad_cursando = 0;
              //let aux_cantidad_finalizada = 0;
              
              //contando cantidad de alumnos cursando practica y con practica finalizada
              this.serviceConfig.obtener_practicas_config_practica(this.AUX_config_practicas[i].id).subscribe({
                next: data => {
                  //console.log(data);
                  respuesta = { ...respuesta, ...data };
                },
                error: error => {
                  console.log(error);
                },
                complete: () => {
                  //console.log("practicas_por_config_practica de ID ", this.AUX_config_practicas[i].id, " : ");
                  //console.log(respuesta.body)

                  let pos_config_practica = this.alumnos_practica_nombre.indexOf(this.AUX_config_practicas[i].nombre);

                  for(i=0;i<respuesta.body.length;i++){

                    if(respuesta.body[i].estado == "Finalizada" || respuesta.body[i].estado == "Aprobada" || respuesta.body[i].estado == "Reprobada") {
                      this.alumnos_practica_finalizada_cantidad[pos_config_practica]++;
                      this.total_alumnos_finalizada_practica_cantidad++;
                    }
                    else{
                      this.alumnos_cursando_practica_cantidad[pos_config_practica]++;
                      this.total_alumnos_cursando_practica_cantidad++;
                    }
                  }

                  //this.alumnos_cursando_practica_cantidad.push(aux_cantidad_cursando);
                  //this.alumnos_practica_finalizada_cantidad.push(aux_cantidad_finalizada);

                  //console.log("alumnos_practica_nombre: ", this.alumnos_practica_nombre);
                  //console.log("alumnos_cursando_practica_cantidad: ", this.alumnos_cursando_practica_cantidad);
                  //console.log("alumnos_practica_finalizada_cantidad: ", this.alumnos_practica_finalizada_cantidad);
                }
              });

              //---------------------FIN CONTANDO ALUMNOS POR PRACTICA------------------    

              if (this.AUX_config_practicas[i].sueldo_promedio !=0 && this.AUX_config_practicas[i].sueldo_promedio != null){
                this.remuneracion_tipo_practica.push({tipo: this.AUX_config_practicas[i].nombre, remuneracion: this.AUX_config_practicas[i].sueldo_promedio});
                this.remuneracion_promedio_tipo_practica += this.AUX_config_practicas[i].sueldo_promedio;
                cantidad_tipos_practicas_remuneracion++;
              } 
            }

            this.remuneracion_promedio_tipo_practica = Math.floor(this.remuneracion_promedio_tipo_practica / cantidad_tipos_practicas_remuneracion);

            this.serviceEstadisticas.obtener_todas_estadisticas().subscribe({
              next: data => {
                respuesta = { ...respuesta, ...data }
              },
              error: error => {
                console.log(error);
              },
              complete: () => {

                this.preguntas_estadisticas_AUX = respuesta.body;

                for (let x = 0; x < this.preguntas_estadisticas_AUX.length; x++) {
                  this.preguntas_estadisticas.push(this.preguntas_estadisticas_AUX[x].pregunta_respuestas.array);
                }

              }
            });

            //obtenemos datos remuneracion por carrera y ramo marcado como util

            this.serviceCarrera.obtener_carreras().subscribe({
              next: data => {
                respuesta = { ...respuesta, ...data }
              },
              error: error => {
                console.log(error);
              },
              complete: () => {
                //console.log("carreras: ", respuesta.body);

                let cantidad_carreras_remuneracion=0;
                for (let i=0; i<respuesta.body.length; i++) {
                  if (respuesta.body[i].sueldo_promedio !=0 && respuesta.body[i].sueldo_promedio != null){
                    this.remuneracion_por_carrera.push({carrera: respuesta.body[i].nombre, remuneracion: respuesta.body[i].sueldo_promedio});
                    this.remuneracion_promedio_por_carrera += respuesta.body[i].sueldo_promedio;
                    cantidad_carreras_remuneracion++;
                  }
                  

                  if (respuesta.body[i].id ==this.id_carrera_encargado){  
                    let sueldo_ramos_AUX = respuesta.body[i].sueldo_ramos.array;
                    //console.log("sueldo_ramos_AUX: ", sueldo_ramos_AUX);
                    for(let j=0; j<sueldo_ramos_AUX.length; j=j+2) {
                      //console.log("j: ", j);
                      //console.log("sueldo_ramos_AUX[j]: ", sueldo_ramos_AUX[j]);
                      //console.log("sueldo_ramos_AUX[j+1]: ", sueldo_ramos_AUX[j+1]);
                      this.remuneracion_por_ramo_util.push({ramo: sueldo_ramos_AUX[j], remuneracion: sueldo_ramos_AUX[j+1]});
                      this.remuneracion_promedio_por_ramo_util += sueldo_ramos_AUX[j+1];
                    }
                    this.remuneracion_promedio_por_ramo_util = Math.floor(this.remuneracion_promedio_por_ramo_util / (sueldo_ramos_AUX.length/2));
                  }
                }
                this.remuneracion_promedio_por_carrera = Math.floor(this.remuneracion_promedio_por_carrera / cantidad_carreras_remuneracion);

                //console.log("remuneracion_por_carrera: ", this.remuneracion_por_carrera);
                //console.log("remuneracion_promedio_por_carrera: ", this.remuneracion_promedio_por_carrera);
              }
            });

            //obtenemos datos remuneracion por empresa

            this.serviceEmpresa.obtener_empresas().subscribe({
              next: data => {
                respuesta = { ...respuesta, ...data }
              },
              error: error => {
                console.log(error);
              },
              complete: () => {
                //console.log("empresas: ", respuesta.body);
                let cantidad_empresas_remuneracion=0;
                for (let i=0; i<respuesta.body.length; i++) {
                  this.nombre_empresas.push(respuesta.body[i].nombre_empresa);
                  this.valoracion_empresas.push(respuesta.body[i].calificacion_promedio);
                  if (respuesta.body[i].sueldo_promedio !=0 && respuesta.body[i].sueldo_promedio != null){
                    this.remuneracion_por_empresa.push({empresa: respuesta.body[i].nombre_empresa, remuneracion: respuesta.body[i].sueldo_promedio});
                    this.remuneracion_promedio_por_empresa += respuesta.body[i].sueldo_promedio;
                    cantidad_empresas_remuneracion++;
                  }  
                }
                //console.log("nombre_empresas: ", this.nombre_empresas)
                //console.log("valoracion_empresas: ", this.valoracion_empresas)

                //ordenar valoracion de mayor a menor
                for (let i = 0; i < this.valoracion_empresas.length; i++) {
                  for (let k = 0; k < this.valoracion_empresas.length; k++) {
                    if (this.valoracion_empresas[i] > this.valoracion_empresas[k]) {
                      let aux = this.valoracion_empresas[i];
                      this.valoracion_empresas[i] = Math.round(this.valoracion_empresas[k] * 10) / 10;
                      this.valoracion_empresas[k] = aux;
        
                      let aux2 = this.nombre_empresas[i];
                      this.nombre_empresas[i] = this.nombre_empresas[k];
                      this.nombre_empresas[k] = aux2;
                    }
                  }
                }
                //console.log("nombre_empresas_ordenado: ", this.nombre_empresas)
                //console.log("valoracion_empresas_ordenado: ", this.valoracion_empresas)

                this.nombre_empresas_top5 = this.nombre_empresas.slice(0,5);
                this.valoracion_empresas_top5 = this.valoracion_empresas.slice(0,5);

                //console.log("nombre_empresas_ordenado_TOP5: ", this.nombre_empresas_top5)
                //console.log("valoracion_empresas_ordenado_TOP5: ", this.valoracion_empresas_top5)


                this.remuneracion_promedio_por_empresa = Math.floor(this.remuneracion_promedio_por_empresa / cantidad_empresas_remuneracion);

              }
            });

          } 
        });
      }
    });
  }

  cambiar_config_practica(arg: any) {
    this.id_config_practica_mostrar = arg.target.value;
    this.preguntas_mostrar = [];
    
    for (let i=0; i<this.preguntas_estadisticas.length; i++) {
      if (this.preguntas_estadisticas[i][0] == this.id_config_practica_mostrar) {
        this.preguntas_mostrar.push(this.preguntas_estadisticas[i]);
      }
    }
  }

  cambio_vista(arg: any) {
    
    if ( arg == "general" ) {
      //console.log("general");
      this.vista_actual = "general";
    }
    else if ( arg == "aptitudes" ) {
      //console.log("aptitudes");
      this.vista_actual = "aptitudes";
    }
    else if( arg == "remuneracion" ) {
      //console.log("remuneracion");
      this.vista_actual = "remuneracion";
    }
    else if( arg == "encuesta" ) {
      //console.log("encuesta_final");
      this.vista_actual = "encuesta";
    }
  }

  isNumber(val: any){ return typeof val === 'number'; }

  largo_arreglo(arg: any) {
    return arg.length;
  }

  toInt(arg: any) {
    return parseInt(arg);
  }

  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
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
}
