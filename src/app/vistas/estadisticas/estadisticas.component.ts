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

  id_carrera_encargado = 0;

  ngOnInit(): void {

    //HARDCODEO REMUNERACION TIPO PRACTICA
    /*
    this.remuneracion_tipo_practica.push({tipo: "Hola1", remuneracion: 100});
    this.remuneracion_tipo_practica.push({tipo: "Hola2", remuneracion: 200});
    this.remuneracion_tipo_practica.push({tipo: "Hola3", remuneracion: 300});
    this.remuneracion_promedio_tipo_practica = 200;
    */

    //HARDCODEO REMUNERACION POR CARRERA
    /*
    this.remuneracion_por_carrera.push({carrera: "Informatica", remuneracion: 210000});
    this.remuneracion_por_carrera.push({carrera: "Minas", remuneracion: 200000});
    this.remuneracion_por_carrera.push({carrera: "Industrial", remuneracion: 190000});
    this.remuneracion_por_carrera.push({carrera: "Matematica", remuneracion: 215000});
    this.remuneracion_promedio_por_carrera = 203750;
    */

    //HARDCODEO REMUNERACION POR EMPRESA
    /*
    this.remuneracion_por_empresa.push({empresa: "Empresa1", remuneracion: 210000});
    this.remuneracion_por_empresa.push({empresa: "Empresa2", remuneracion: 200000});
    this.remuneracion_por_empresa.push({empresa: "Empresa3", remuneracion: 190000});
    this.remuneracion_por_empresa.push({empresa: "Empresa4", remuneracion: 170000});
    this.remuneracion_por_empresa.push({empresa: "Empresa5", remuneracion: 165000});
    this.remuneracion_promedio_por_empresa = 187000;
    */

    //HARDCODEO REMUNERACION POR RAMO UTIL
    /*
    this.remuneracion_por_ramo_util.push({ramo: "Ramo1", remuneracion: 210000});
    this.remuneracion_por_ramo_util.push({ramo: "Ramo2", remuneracion: 200000});
    this.remuneracion_por_ramo_util.push({ramo: "Ramo3", remuneracion: 190000});
    this.remuneracion_promedio_por_ramo_util = 200000;
    */

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

        //console.log("id_carrera_encargado: ", respuesta.body.id_carrera);

        this.id_carrera_encargado = respuesta.body.id_carrera;

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
            for (let i=0; i<this.AUX_config_practicas.length; i++) {
              this.remuneracion_tipo_practica.push({tipo: this.AUX_config_practicas[i].nombre, remuneracion: this.AUX_config_practicas[i].sueldo_promedio});
              this.remuneracion_promedio_tipo_practica += this.AUX_config_practicas[i].sueldo_promedio;
            }
            this.remuneracion_promedio_tipo_practica = Math.floor(this.remuneracion_promedio_tipo_practica / this.AUX_config_practicas.length);

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

            //obtenemos datos remuneracion por carrera

            this.serviceCarrera.obtener_carreras().subscribe({
              next: data => {
                respuesta = { ...respuesta, ...data }
              },
              error: error => {
                console.log(error);
              },
              complete: () => {
                //console.log("carreras: ", respuesta.body);
                for (let i=0; i<respuesta.body.length; i++) {
                  this.remuneracion_por_carrera.push({carrera: respuesta.body[i].nombre, remuneracion: respuesta.body[i].sueldo_promedio});
                  this.remuneracion_promedio_por_carrera += respuesta.body[i].sueldo_promedio;

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
                this.remuneracion_promedio_por_carrera = Math.floor(this.remuneracion_promedio_por_carrera / respuesta.body.length);

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
                for (let i=0; i<respuesta.body.length; i++) {
                  this.remuneracion_por_empresa.push({empresa: respuesta.body[i].nombre_empresa, remuneracion: respuesta.body[i].sueldo_promedio});
                  this.remuneracion_promedio_por_empresa += respuesta.body[i].sueldo_promedio;
                }
                this.remuneracion_promedio_por_empresa = Math.floor(this.remuneracion_promedio_por_empresa / respuesta.body.length);

                //console.log("remuneracion_por_empresa: ", this.remuneracion_por_empresa);
                //console.log("remuneracion_promedio_por_empresa: ", this.remuneracion_promedio_por_empresa);
              }
            });

            //obtenemos datos remuneracion por ramo util

          }
        });
      }
    });


    
    //let respuesta: any = {};

    //OBTENIENDO FECHA ACTUALIZACION ESTADISTICAS
    /*
    this.serviceEstadisticas.obtener_actualizacion_estadistica().subscribe({
      next: data => {
        //console.log(data);
        respuesta = { ...respuesta, ...data }
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        //console.log(respuesta);
        //this.dia_actualizacion_estadisticas_AUX = respuesta.body;
        
        //console.log("dia_actualizacion_DB");
        //console.log(respuesta.body.dia_actualizacion);
        //this.dia_actualizacion_DB = respuesta.body.dia_actualizacion;
      

      this.serviceEstadisticas.obtener_todas_estadisticas().subscribe({
        next: data => {
          //console.log(data);
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

          //console.log("preguntas_estadisticas desde DB");
          //console.log(this.preguntas_estadisticas);

          this.serviceEstadisticas.obtener_todas_config_practicas().subscribe({
            next: data => {
              respuesta = { ...respuesta, ...data }
            },
            error: error => {
              console.log(error);
            },
            complete: () => {
    
              //OBTENIENDO CONFIG_PRACTICAS
              this.AUX_config_practicas = respuesta.body;
              //console.log(this.AUX_config_practicas);
          
              //var currDate = new Date();
              //console.log(typeof currDate.getDay());

              //console.log("estado_DB", localStorage.getItem('estado_DB'))
            }
          });
        }
      });
      }
    });
    */
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
      console.log("general");
      this.vista_actual = "general";
    }
    else if ( arg == "aptitudes" ) {
      console.log("aptitudes");
      this.vista_actual = "aptitudes";
    }
    else if( arg == "remuneracion" ) {
      console.log("remuneracion");
      this.vista_actual = "remuneracion";
    }
    else if( arg == "encuesta" ) {
      console.log("encuesta_final");
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
}
