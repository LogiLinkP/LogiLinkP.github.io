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


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
})
export class EstadisticasComponent {
  constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef, @Inject(DOCUMENT) private document: Document, private router: Router, private serviceUsuario: DataUsuarioService,
  private serviceBarra: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute, private serviceConfig: ConfigService,
  private servicePreguntas: PreguntasEncuestaFinalService, private _snackbar: MatSnackBar, private serviceEstadisticas : EstadisticasService) {}

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

  ngOnInit(): void {

    let id_usuario = this.sesion.userdata.id;

    console.log("id_usuario: ", id_usuario);
    

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

        console.log("id_carrera_encargado: ", respuesta.body.id_carrera);

        this.serviceConfig.obtener_config_practica_carrera(respuesta.body.id_carrera).subscribe({
          next: data => {
            //console.log(data);
            respuesta = { ...respuesta, ...data };
          },
          error: error => {
            console.log(error);
          },
          complete: () => {
            console.log("config_practica_carrera: ", respuesta.body);
            this.AUX_config_practicas = respuesta.body;

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
