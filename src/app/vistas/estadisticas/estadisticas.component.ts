import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'

import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';

import { PreguntasEncuestaFinalService } from 'src/app/servicios/alumno/preguntas-encuesta-final.service';
import { EstadisticasService } from 'src/app/servicios/estadisticas/estadisticas.service';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent {
  constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef, @Inject(DOCUMENT) private document: Document, private router: Router,
  private serviceBarra: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute, private serviceConfig: ConfigService ,
  private servicePreguntas: PreguntasEncuestaFinalService, private _snackbar: MatSnackBar, private serviceEstadisticas : EstadisticasService) {}

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

  //ancho = 80;
  
  //config_practicaFORM = new FormControl('')

  //completado = 0;

  ngOnInit(): void {
    
    //let AUX_config_practicas: any = {};
    //let AUX_respuestas_encuestas: any = {};
    //let AUX_preguntas_encuestas: any = {};

    //console.log(UsuarioService);

    let respuesta: any = {};

    //OBTENIENDO FECHA ACTUALIZACION ESTADISTICAS
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
  }

  cambiar_config_practica(arg: any) {
    this.id_config_practica_mostrar = arg.target.value;
    this.preguntas_mostrar = [];
    //MOSTRANDO PREGUNTAS ABIERTAS
    /*
    for (let i=0; i<this.preguntas_abiertas_respuestas.length; i++) {
      if (this.preguntas_abiertas_respuestas[i][0] == this.id_config_practica_mostrar) {
        this.preguntas_mostrar.push(this.preguntas_abiertas_respuestas[i]);
      }
    }
    */
    for (let i=0; i<this.preguntas_estadisticas.length; i++) {
      if (this.preguntas_estadisticas[i][0] == this.id_config_practica_mostrar) {
        this.preguntas_mostrar.push(this.preguntas_estadisticas[i]);
      }
    }
    //console.log("preguntas_mostrar");
    //console.log(this.preguntas_mostrar);
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
