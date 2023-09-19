import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';

import { CarreraService } from 'src/app/servicios/carrera/carrera.service';
import { RespuestaRamosService } from 'src/app/servicios/respuesta-ramos/respuesta-ramos.service';

import { PreguntasEncuestaFinalService } from 'src/app/servicios/alumno/preguntas-encuesta-final.service';

@Component({
  selector: 'app-ingreso-informe',
  templateUrl: './ingreso-informe.component.html',
  styleUrls: ['./ingreso-informe.component.scss']
})
export class IngresoInformeComponent {
  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, 
  private service_obtener: ObtenerDatosService, private route: ActivatedRoute, private serviceCarrera: CarreraService, 
  private servicePreguntas: PreguntasEncuestaFinalService, private _snackbar: MatSnackBar, private ramosService: RespuestaRamosService) {}

    activated_route: ActivatedRoute = this.route;
  
    id_config_practica = Number(this.activated_route.snapshot.paramMap.get('id_config_practica'));
    
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
      console.log("CONTADOR PREGUNTAS", this.contador_preguntas);
      
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
      console.log("CONTADOR PREGUNTAS", this.contador_preguntas);
  
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
  
      console.log("ID CONFIG PRACTICA", this.id_config_practica);
      //console.log("PARAMETRO", this.parametro);
  
      let respuesta: any = {};
  
      this.servicePreguntas.obtener_preguntas(this.id_config_practica).subscribe({
        next: data => {
          //console.log(data);
          respuesta = { ...respuesta, ...data }
        
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
              else {
                this.respuestas.push("");
              }
              this.tipo_respuestas.push(pregunta.tipo_respuesta);
            }
            console.log("RESPUESTAS", this.respuestas);
          }
  
          //CREAR PREGUNTA DE RAMOS SEGUN CARRERA
          //console.log("ID CONFIG PRACTICA", this.id_config_practica);
  
          //console.log("userData", this.sesion.userdata);
  
          this.service_obtener.obtener_estudiante(this.sesion.userdata.id).subscribe({
            next: data => {
              //console.log(data);
              respuesta = { ...respuesta, ...data }
            },
            error: error => {
              console.log(error);
            },
            complete: () => {
              console.log("id_carrera",respuesta.body.id_carrera);
              this.id_carrera_estudiante = respuesta.body.id_carrera;
              
              this.serviceCarrera.obtener_carrera(respuesta.body.id_carrera).subscribe({
                next: data => {
                  //console.log(data);
                  respuesta = { ...respuesta, ...data }
                }
                ,
                error: error => {
                  console.log(error);
                }
                ,
                complete: () => {
                  //console.log('complete');
                  //console.log(respuesta.body);
                  console.log(respuesta.body.ramos);
                  this.array_ramos = respuesta.body.ramos.split(",");
                  console.log(this.array_ramos);
  
                  console.log("PREGUNTAS", this.preguntas);
                  console.log("RESPUESTAS", this.respuestas);
                  console.log("TIPO RESPUESTAS", this.tipo_respuestas);
  
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
  
                  //console.log("STRING RAMOS", string_ramos);
  
  
                  let pregunta_ramos = {
                    "enunciado": "¿Qué ramos de la carrera te han resulatado útiles durante tu práctica?",
                    "tipo_respuesta": "casillas",
                    "opciones": string_ramos
                  }
  
                  //agregar pregunta de ramos al arreglo de preguntas
                  this.preguntas.push(pregunta_ramos);
  
                  console.log("PREGUNTAS CON RAMO", this.preguntas);
                  this.tipo_respuestas.push("casillas");
                  this.respuestas.push([]);
  
                  //console.log(this.array_ramos);
                }
              });
            }
          });
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
  
      // for que envia respuestas
  
      for (let i = 0; i < this.respuestas.length; i++) {
        let respuesta_aux = "";
  
        //pregunta de ramos
        if (this.preguntas[i].enunciado == "¿Qué ramos de la carrera te han resulatado útiles durante tu práctica?"){
          console.log("hay una pregunta de ramos");
          let ramos_aux = "";
          for (let j = 0; j < this.respuestas[i].length; j++) {
            if (this.respuestas[i][j]) {
              ramos_aux += this.array_ramos[j];
              ramos_aux += ";;";
            }
          }
          ramos_aux = ramos_aux.slice(0, -2);
          console.log("RAMOS AUX", ramos_aux);
  
          this.ramosService.crear_respuesta_ramos(this.id_carrera_estudiante, ramos_aux).subscribe({
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
  
        //pregunta estandar
        else{
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
