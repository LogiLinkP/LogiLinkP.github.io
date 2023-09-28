//import { Component } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';

import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';
import { CarreraService } from 'src/app/servicios/carrera/carrera.service';
import { RespuestaRamosService } from 'src/app/servicios/respuesta-ramos/respuesta-ramos.service';

import { PreguntasEncuestaFinalService } from 'src/app/servicios/alumno/preguntas-encuesta-final.service';

@Component({
  selector: 'app-encuesta-fin-practica',
  templateUrl: './encuesta-fin-practica.component.html',
  styleUrls: ['./encuesta-fin-practica.component.scss']
})
export class EncuestaFinPracticaComponent {

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private service_obtener: ObtenerDatosService,
    private route: ActivatedRoute, private serviceCarrera: CarreraService,
    private servicePreguntas: PreguntasEncuestaFinalService, private _snackbar: MatSnackBar, private ramosService: RespuestaRamosService) { }

  //id_config_practica = 2; // hardcodeado

  activated_route: ActivatedRoute = this.route;

  id_practica = Number(this.activated_route.snapshot.paramMap.get('id_practica'));

  id_config_practica = 0

  sesion: any = JSON.parse(localStorage.getItem("auth-user") || "{}")
  //id_usuario = this.sesion.userdata.id;

  pregunta_actual = 0;

  contador_preguntas = 0;

  preguntas: any[] = [];
  tipo_respuestas: any[] = [];
  respuestas: any[] = [];

  array_ramos: any[] = [];

  id_carrera_estudiante = 0;

  //preguntas_encuesta: object[] = [];

  //enunciados_preguntas: string[] = [];
  //tipos_preguntas: string[] = [];
  //opciones_preguntas: string[][] = [];

  //array_values: any[] = [];

  isAnimating = false;
  izq() {
    if (this.isAnimating) {
      return; // Don't allow animation if one is already in progress
    }

    this.contador_preguntas -= 1;

    let id = `#cont_respuesta${this.pregunta_actual}`;
    let id_izq = `#cont_respuesta${this.pregunta_actual - 1}`;

    this.isAnimating = true; // Set the flag

    $(id).fadeOut(() => {
      $(id).css("display", "none");
      $(id_izq).css({ "display": "block" });
      $(id_izq).fadeIn(() => {
        this.isAnimating = false; // Reset the flag when animation is complete
      });
      this.pregunta_actual -= 1;
    });
  }

  der() {
    if (this.isAnimating) {
      return; // Don't allow animation if one is already in progress
    }

    this.contador_preguntas += 1;

    let id = `#cont_respuesta${this.pregunta_actual}`;
    let id_der = `#cont_respuesta${this.pregunta_actual + 1}`;

    this.isAnimating = true; // Set the flag

    $(id).fadeOut(() => {
      $(id).css("display", "none");
      $(id_der).css({ "display": "block" });
      $(id_der).fadeIn(() => {
        this.isAnimating = false; // Reset the flag when animation is complete
      });
      this.pregunta_actual += 1;
    });
  }

  lenght_preguntas() {
    return this.preguntas.length;
  }


  ngOnInit(): void {

    let respuesta: any = {};

    this.service_obtener.obtener_practica_id(this.id_practica).subscribe({
      next: data => {
        respuesta = { ...respuesta, ...data }
      },
      error: error => {
      },
      complete: () => {
        this.id_config_practica = respuesta.body.id_config_practica;

        this.servicePreguntas.obtener_preguntas(this.id_config_practica).subscribe({
          next: data => {
            respuesta = { ...respuesta, ...data }

          },
          error: error => {
          },
          complete: () => {

            this.preguntas = respuesta.body;

            if (this.preguntas.length > 0) {
              for (let pregunta of this.preguntas) {
                if (pregunta.tipo_respuesta == "casillas") {
                  let array_aux = [];
                  for (let i = 0; i < pregunta.opciones.split(";;").length; i++) {
                    array_aux.push(false);
                  }
                  this.respuestas.push(array_aux);
                }
                else {
                  this.respuestas.push("");
                }
                this.tipo_respuestas.push(pregunta.tipo_respuesta);
              }
            }

            //CREAR PREGUNTA DE RAMOS SEGUN CARRERA

            this.service_obtener.obtener_estudiante(this.sesion.userdata.id).subscribe({
              next: data => {
                respuesta = { ...respuesta, ...data }
              },
              error: error => {
              },
              complete: () => {
                this.id_carrera_estudiante = respuesta.body.id_carrera;

                this.serviceCarrera.obtener_carrera(respuesta.body.id_carrera).subscribe({
                  next: data => {
                    respuesta = { ...respuesta, ...data }
                  }
                  ,
                  error: error => {
                  }
                  ,
                  complete: () => {

                    //AGREGANDO PREGUNTA DE RAMOS
                    this.array_ramos = respuesta.body.ramos.split(",");

                    //crear objeto con las preguntas de ramos
                    //crear objeto con las preguntas sobre la empresa

                    let string_ramos = "";

                    for (let i = 0; i < this.array_ramos.length; i++) {
                      if (i == this.array_ramos.length - 1) {
                        string_ramos += this.array_ramos[i];
                      }
                      else {
                        string_ramos += this.array_ramos[i] + ";;";
                      }
                    }


                    let pregunta_ramos = {
                      "enunciado": "¿Qué ramos de la carrera te han resultado útiles durante tu práctica?",
                      "tipo_respuesta": "casillas",
                      "opciones": string_ramos
                    }

                    //agregar pregunta de ramos al arreglo de preguntas
                    this.preguntas.push(pregunta_ramos);

                    this.tipo_respuestas.push("casillas");
                    this.respuestas.push([]);

                    //AGREGANDO PREGUNTAS DE EMPRESA

                    let evaluacion_empresa = {
                      "enunciado": "Evalúa la empresa donde realizaste tu practica entre 1 y 5 considerando que tanto la recomendarías para que un estudiante realizara su práctica allí",
                      "tipo_respuesta": "alternativas",
                      "opciones": "1;;2;;3;;4;;5"
                    }

                    let comentario_empresa = {
                      "enunciado": "¿Qué te pareció la empresa donde realizaste tu práctica?",
                      "tipo_respuesta": "abierta",
                    }

                    this.preguntas.push(evaluacion_empresa);
                    this.preguntas.push(comentario_empresa);

                  }
                });
              }
            });
          }
        });
      }
    });
  }

  updateRespuestasAbierta(index: number, value: string) {
    this.respuestas[index] = value;
  }

  updateRespuestasCasillas(i: number, j: number, value: string) {
    this.respuestas[i][j] = value;
  }

  updateRespuestasAlternativas(i: number, value: string) {
    this.respuestas[i] = value;
  }

  enviarRespuestas() {

    let respuestas_aux = [];

    for (let i = 0; i < this.respuestas.length; i++) {
      if (this.respuestas[i] == "" || this.respuestas[i] == -1 || this.respuestas[i].length == 0) {
        this._snackbar.open("Error: no se han respondido todas las preguntas.", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
        return;
      }
    }

    // for que envia respuestas

    for (let i = 0; i < this.respuestas.length; i++) {
      let respuesta_aux = "";

      //pregunta de ramos
      if (this.preguntas[i].enunciado == "¿Qué ramos de la carrera te han resultado útiles durante tu práctica?") {
        let ramos_aux = "";
        for (let j = 0; j < this.respuestas[i].length; j++) {
          if (this.respuestas[i][j]) {
            ramos_aux += this.array_ramos[j];
            ramos_aux += ";;";
          }
        }
        ramos_aux = ramos_aux.slice(0, -2);

        this.ramosService.crear_respuesta_ramos(this.id_carrera_estudiante, ramos_aux).subscribe({
          next: (data: any) => {
          },
          error: (error: any) => {
            this._snackbar.open("Error al enviar la respuesta", "Cerrar", {
              duration: 2000,
              panelClass: ['red-snackbar']
            });
          },
          complete: () => {
            this._snackbar.open("Encuesta enviada. Redirigiendo a página principal...", "Cerrar", {
              duration: 3000,
              panelClass: ['green-snackbar']
            });
          }
        });

      }

      //pregunta calificacion empresa
      if (this.preguntas[i].enunciado == "Evalúa la empresa donde realizaste tu practica entre 1 y 5 considerando que tanto la recomendarías para que un estudiante realizara su práctica allí") {
        this.servicePreguntas.agregar_calificacion_empresa(this.id_practica, Number(this.respuestas[i])).subscribe({
          next: (data: any) => {
          },
          error: (error: any) => {
            this._snackbar.open("Error al enviar la respuesta", "Cerrar", {
              duration: 2000,
              panelClass: ['red-snackbar']
            });
          },
          complete: () => {
            this._snackbar.open("Encuesta enviada. Redirigiendo a página principal...", "Cerrar", {
              duration: 3000,
              panelClass: ['green-snackbar']
            });
          }
        });
      }

      //pregunta comentario empresa
      if (this.preguntas[i].enunciado == "¿Qué te pareció la empresa donde realizaste tu práctica?") {
        this.servicePreguntas.agregar_comentario_empresa(this.id_practica, this.respuestas[i]).subscribe({
          next: (data: any) => {
          },
          error: (error: any) => {
            this._snackbar.open("Error al enviar la respuesta", "Cerrar", {
              duration: 2000,
              panelClass: ['red-snackbar']
            });
          },
          complete: () => {
            this._snackbar.open("Encuesta enviada. Redirigiendo a página principal...", "Cerrar", {
              duration: 3000,
              panelClass: ['green-snackbar']
            });
          }
        });
      }

      //pregunta estandar
      else {
        if (this.tipo_respuestas[i] == "casillas") {
          for (let j = 0; j < this.respuestas[i].length; j++) {
            if (this.respuestas[i][j]) {
              respuesta_aux += "1";
            }
            else {
              respuesta_aux += "0";
            }
            if (j != this.respuestas[i].length - 1) {
              respuesta_aux += ",";
            }
          }
        }
        //si es de alternativas
        else {
          let index = this.preguntas[i].opciones.split(";;").indexOf(this.respuestas[i]);
          for (let j = 0; j < this.preguntas[i].opciones.split(";;").length; j++) {
            if (j == index) {
              respuesta_aux += "1";
            }
            else {
              respuesta_aux += "0";
            }
            if (j != this.preguntas[i].opciones.split(";;").length - 1) {
              respuesta_aux += ",";
            }
          }
        }
        respuestas_aux.push(respuesta_aux);

        this.servicePreguntas.agregar_respuesta(this.preguntas[i].id, respuesta_aux).subscribe({
          next: (data: any) => {
          },
          error: (error: any) => {
            this._snackbar.open("Error al enviar la respuesta", "Cerrar", {
              duration: 2000,
              panelClass: ['red-snackbar']
            });
          },
          complete: () => {
            this._snackbar.open("Encuesta enviada. Redirigiendo a página principal...", "Cerrar", {
              duration: 3000,
              panelClass: ['green-snackbar']
            });
          }
        });
      }
    }

    // after 2 seconds, redirect to home
    setTimeout(() => {
      this.router.navigate(['/']);
    }
      , 3000);

  }

  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }

}
