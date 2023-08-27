//import { Component } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'

import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';

import { PreguntasEncuestaFinalService } from 'src/app/servicios/alumno/preguntas-encuesta-final.service';

@Component({
  selector: 'app-encuesta-fin-practica',
  templateUrl: './encuesta-fin-practica.component.html',
  styleUrls: ['./encuesta-fin-practica.component.scss']
})
export class EncuestaFinPracticaComponent {

  constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef, @Inject(DOCUMENT) private document: Document, private router: Router,
                private serviceBarra: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute,
                private serviceComplete: ConfigService, private servicePreguntas: PreguntasEncuestaFinalService, private _snackbar: MatSnackBar) {}

  //id_config_practica = 2; // hardcodeado

  activated_route: ActivatedRoute = this.route;
  
  id_config_practica = Number(this.activated_route.snapshot.paramMap.get('id_config_practica'));

  pregunta_actual = 0;

  preguntas: any[] = [];
  tipo_respuestas: any[] = [];
  respuestas: any[] = []; 


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


  ngOnInit(): void {

    console.log("ID CONFIG PRACTICA", this.id_config_practica);
    //console.log("PARAMETRO", this.parametro);

    let respuesta: any = {};

    this.servicePreguntas.obtener_preguntas(this.id_config_practica).subscribe({
      next: data => {
        //console.log(data);
        respuesta = { ...respuesta, ...data }



        //console.log(data);
        //console.log(respuesta);

        /*
        console.log(respuesta.body);
        console.log(respuesta.body.length);

        for (let i = 0; i < respuesta.body.length; i++) {
          console.log(respuesta.body[i]);
          this.preguntas_encuesta.push(respuesta.body[i]);
        }

        console.log(this.preguntas_encuesta);
        console.log(Object.values(this.preguntas_encuesta[0]));
        */

        
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');

        this.preguntas = respuesta.body;
        //console.log(this.preguntas);

        //console.log(this.preguntas[2].opciones.split(';;'));

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

  enviarRespuestas() {
    console.log("Enviando evaluación...")
    console.log(this.respuestas);

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
      console.log("RESPUESTA AUX", respuesta_aux);

      console.log("ID PREGUNTA", this.preguntas[i].id);
      //console.log("RESPUESTA", respuesta_aux);

      
      this.servicePreguntas.agregar_respuesta(this.preguntas[i].id, respuesta_aux).subscribe({
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
          this._snackbar.open("Encuesta enviada. Redirigiendo a página principal...", "Cerrar", {
            duration: 3000,
            panelClass: ['green-snackbar']
          });
        }
      });
         
    }

    //console.log("RESPUESTAS A ENVIAR EN QUERY", respuestas_aux);
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
