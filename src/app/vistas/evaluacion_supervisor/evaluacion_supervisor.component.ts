import { Component } from '@angular/core';
import { SupervisorService } from '../../servicios/supervisor/supervisor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from "@angular/router"
import * as $ from 'jquery';

@Component({
  selector: 'evaluacion_supervisor',
  templateUrl: './evaluacion_supervisor.component.html',
  styleUrls: ['./evaluacion_supervisor.component.scss']
})
export class EvaluacionComponent {

  id_config_practica = -1;
  practica: any = {};
  preguntas: any[] = [];
  pregunta_actual = 1;
  tipo_respuestas: any[] = [];

  // Aqui se guardan temporalmente las respuestas mientras se llena el formulario. Estas se procesan antes de enviarlas al backend.
  respuestas: any[] = []; 


  constructor(private service_supervisor: SupervisorService, private _snackbar: MatSnackBar, private router: Router, private activated_route: ActivatedRoute) {

  }

  izq() {
    let id = `#cont_respuesta${this.pregunta_actual}`;
    let id_izq = `#cont_respuesta${this.pregunta_actual - 1}`;
    $(id).fadeOut(() => {
      $(id).css("display", "none");
      $(id_izq).css({ "display": "block" });
      $(id_izq).fadeIn();
      this.pregunta_actual -= 1;
    });
  }

  der() {
    let id = `#cont_respuesta${this.pregunta_actual}`;
    let id_der = `#cont_respuesta${this.pregunta_actual + 1}`;
    $(id).fadeOut(() => {
      $(id).css("display", "none");
      $(id_der).css({ "display": "block" });
      $(id_der).fadeIn();
      this.pregunta_actual += 1;
    });
  }


  ngOnInit(): void {
    //obtain id_practica from url
    let token = "";
    let iv = "";
    let practica = { body: {} };

    this.activated_route.queryParams.subscribe(params => {
      token = params['token'];
      iv = params['iv'];
    });

    this.service_supervisor.getPractica(token, iv).subscribe({
      next: (data: any) => {
        practica = { ...practica, ...data };
      },
      error: (error: any) => {
        console.log(error);
        this._snackbar.open("Error al obtener la práctica", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        this.practica = practica.body;
        console.log("PRACTICA OBTENIDA", practica);
        if (this.practica.hasOwnProperty('id_config_practica') && this.practica.hasOwnProperty('config_practica')) {
          this.id_config_practica = this.practica.id_config_practica
          if (this.practica.config_practica.hasOwnProperty('pregunta_supervisors')) {
            this.preguntas = this.practica.config_practica.pregunta_supervisors;
            console.log("PREGUNTAS", this.preguntas);
            if (this.preguntas.length > 0) {
              for (let pregunta of this.preguntas) {
                if (pregunta.tipo_respuesta == "casillas") {
                  let array_aux = [];
                  for (let i = 0; i < pregunta.opciones.split(";;").length; i++) {
                    array_aux.push(false);
                  }
                  this.respuestas.push(array_aux);
                }
                else if (pregunta.tipo_respuesta == "evaluacion") {
                  this.respuestas.push(-1);
                }
                else {
                  this.respuestas.push("");
                }
                this.tipo_respuestas.push(pregunta.tipo_respuesta);
              }
              console.log("RESPUESTAS", this.respuestas);
            }
            else {
              this._snackbar.open("Error: la práctica no tiene preguntas asociadas.", "Cerrar", {
                duration: 2000,
                panelClass: ['red-snackbar']
              });
              return;
            }
          }
          else {
            this._snackbar.open("Error: la práctica no tiene preguntas asociadas.", "Cerrar", {
              duration: 2000,
              panelClass: ['red-snackbar']
            });
            return;
          }
        }
        else {
          this._snackbar.open("Error: la práctica no tiene configuración asociada.", "Cerrar", {
            duration: 2000,
            panelClass: ['red-snackbar']
          });
          return;
        }
      }
    });
  }

  updateRespuestasAbierta(index: number, value: string) {
    console.log("UPDATEANDO RESPUESTAS abierta", value)
    this.respuestas[index] = value;
    console.log(this.respuestas);
  }

  updateRespuestasCasillas(i: number, j: number, value: string) {
    console.log("UPDATEANDO RESPUESTAS casillas", value)
    this.respuestas[i][j] = value;
    console.log(this.respuestas);
  }

  updateRespuestasAlternativas(i: number, value: string) {
    console.log("UPDATEANDO RESPUESTAS alternativas", value);
    this.respuestas[i] = value;
    console.log(this.respuestas);
  }

  updateRespuestasEvaluacion(index: number, value: number) {
    console.log("UPDATEANDO RESPUESTAS evaluacion", value);
    this.respuestas[index] = value;
    console.log(this.respuestas);
  }

  enviarEvaluacion() {
    console.log("Enviando evaluación...")
    let respuestas_aux = [];

    // chequear que se hayan respondido todas las preguntas
    for (let i = 0; i < this.respuestas.length; i++) {
      if (this.respuestas[i] == "" || this.respuestas[i] == -1 || this.respuestas[i].length == 0) {
        this._snackbar.open("Error: no se han respondido todas las preguntas.", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
        return;
      }
    }

    // procesamiento de respuestas para convertirlas al formato acordado para el backend
    for (let i = 0; i < this.respuestas.length; i++) {
      let respuesta_aux = "";
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
      else if (this.tipo_respuestas[i] == "evaluacion" || this.tipo_respuestas[i] == "abierta") {
        respuesta_aux = this.respuestas[i];
      }
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

      // enviar respuestas al backend
      this.service_supervisor.sendAnswer(this.preguntas[i].id, this.practica.id, respuesta_aux).subscribe({
        next: (data: any) => {
        },
        error: (error: any) => {
          console.log(error);
          this._snackbar.open("Error al enviar la respuesta", "Cerrar", {
            duration: 2000,
            panelClass: ['red-snackbar']
          });
        },
        complete: () => {
          this._snackbar.open("Evaluación enviada", "Cerrar", {
            duration: 2000,
            panelClass: ['green-snackbar']
          });
        }
      });
    }
    console.log("RESPUESTAS A ENVIAR EN QUERY", respuestas_aux);

  }
}
