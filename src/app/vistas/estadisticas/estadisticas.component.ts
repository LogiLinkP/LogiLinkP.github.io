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

  ancho = 80;
  
  //config_practicaFORM = new FormControl('')

  //completado = 0;

  ngOnInit(): void {
    
    //let AUX_config_practicas: any = {};
    //let AUX_respuestas_encuestas: any = {};
    //let AUX_preguntas_encuestas: any = {};

    let respuesta: any = {};

    this.serviceEstadisticas.obtener_todas_config_practicas().subscribe({
      next: data => {
        //console.log(data);
        respuesta = { ...respuesta, ...data }

        //console.log(respuesta);
        
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        //console.log('complete config_practica');

        this.AUX_config_practicas = respuesta.body;
        //console.log(this.AUX_config_practicas);
        //this.completado++;
        
        this.serviceEstadisticas.obtener_respuestas_encuesta_final().subscribe({
          next: data => {
            //console.log(data);
            respuesta = { ...respuesta, ...data }
            
          },
          error: error => {
            console.log(error);
          },
          complete: () => {
            //console.log('complete AUX_respuestas_encuestas');
            this.AUX_respuestas_encuestas = respuesta.body;
            //console.log(this.AUX_respuestas_encuestas);
            //this.completado++;

            this.serviceEstadisticas.obtener_todas_preguntas_encuesta_final().subscribe({
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
                //console.log('complete AUX_preguntas_encuestas');
                this.AUX_preguntas_encuestas = respuesta.body; 
                //console.log(this.AUX_preguntas_encuestas);
                //this.completado++;

                //YA SE OBTUVIERON TODOS LOS DATOS
                console.log("ESTADISTICAS");
                //console.log(this.AUX_config_practicas);
                //console.log(this.AUX_preguntas_encuestas);
                //console.log(this.AUX_respuestas_encuestas);

                //console .log("pruebas individuales");
                //console.log(this.AUX_preguntas_encuestas[0].id_config_practica);
                //for (let i = 0; i < this.AUX_preguntas_encuestas.length; i++) {
                //  console.log(this.AUX_preguntas_encuestas[i].id_config_practica);
                //}

                
                /*
                for (let i = 0; i < this.AUX_config_practicas.length; i++) {
                  let aux_preguntas: any[] = [];
                  aux_preguntas.push(this.AUX_config_practicas[i].id);
                  
                  for (let j = 0; j < this.AUX_preguntas_encuestas.length; j++) {
                    if (this.AUX_config_practicas[i].id == this.AUX_preguntas_encuestas[j].id_config_practica) {
                      aux_preguntas.push(this.AUX_preguntas_encuestas[j]);
                    }
                  }
                  this.preguntas_por_config_practica.push(aux_preguntas);
                }
                */

                //console.log("preguntas_por_config_practica");
                //console.log(this.preguntas_por_config_practica);


                /*
                for (let i = 0; i < this.AUX_preguntas_encuestas.length; i++) {
                  let aux_respuestas: any[] = [];
                  aux_respuestas.push(this.AUX_preguntas_encuestas[i].id);

                  for (let j = 0; j < this.AUX_respuestas_encuestas.length; j++) {
                    if (this.AUX_preguntas_encuestas[i].id == this.AUX_respuestas_encuestas[j].id_pregunta_encuesta_final) {
                      aux_respuestas.push(this.AUX_respuestas_encuestas[j]);
                    }
                  }
                  this.respuestas_por_pregunta.push(aux_respuestas);
                }
                */

                //console.log(this.respuestas_por_pregunta);


                //console.log("pruebas individuales");
                //console.log(this.AUX_respuestas_encuestas[0]);

                //PROCESAR DATOS PARA MOSTRAR

                //PREGUNTAS ABIERTAS

                //console.log(this.AUX_config_practicas);

                //console.log(this.AUX_preguntas_encuestas);
                //console.log(this.AUX_preguntas_encuestas[0].id_config_practica);

                for (let i=0; i<this.AUX_config_practicas.length; i++) {
                  //let aux_config_abiertas: any[] = [];
                  //let aux_config_cas_alt: any[] = [];
                  for(let j=0; j<this.AUX_preguntas_encuestas.length; j++) {
                    let aux_pregunta_abiertas: any[] = [];
                    let aux_pregunta_cas_alt: any[] = [];
                    if (this.AUX_config_practicas[i].id == this.AUX_preguntas_encuestas[j].id_config_practica) {
                      if (this.AUX_preguntas_encuestas[j].tipo_respuesta == "abierta") {

                        //agregar id config_practica 

                        aux_pregunta_abiertas.push(this.AUX_preguntas_encuestas[j].id_config_practica);

                        aux_pregunta_abiertas.push(this.AUX_preguntas_encuestas[j].enunciado);
                        for(let k=0; k<this.AUX_respuestas_encuestas.length; k++) {
                          if (this.AUX_preguntas_encuestas[j].id == this.AUX_respuestas_encuestas[k].id_pregunta_encuesta_final) {
                            aux_pregunta_abiertas.push(this.AUX_respuestas_encuestas[k].respuesta);
                          }
                        }
                        //console.log(aux_pregunta_abiertas);
                        this.preguntas_abiertas_respuestas.push(aux_pregunta_abiertas);
                      }
                      else{

                        //agregar id config_practica
                        //onsole.log("id_config_practica alternativas o casillas:", this.AUX_preguntas_encuestas[j].id_config_practica);
                        aux_pregunta_cas_alt.push(this.AUX_preguntas_encuestas[j].id_config_practica);
                        
                        aux_pregunta_cas_alt.push(this.AUX_preguntas_encuestas[j].enunciado);
                        let aux_lista_opciones = this.AUX_preguntas_encuestas[j].opciones.split(";;");
                        for(let k=0; k<aux_lista_opciones.length; k++) {
                          aux_pregunta_cas_alt.push(aux_lista_opciones[k]);
                          aux_pregunta_cas_alt.push(0);
                        }
                        //console.log("lista preguntas casillas alternativas");
                        //console.log(aux_pregunta_cas_alt);

                        //RECORRER RESPUESTAS Y SUMAR OPCIONES A LISTA
                        let num_respuestas_pregunta = 0;

                        for(let k=0; k<this.AUX_respuestas_encuestas.length; k++) {
                          if (this.AUX_preguntas_encuestas[j].id == this.AUX_respuestas_encuestas[k].id_pregunta_encuesta_final) {
                            num_respuestas_pregunta++;
                            let aux_opciones_seleccionadas = this.AUX_respuestas_encuestas[k].respuesta.split(",");
                            //console.log("lista opciones seleccionadas");
                            //console.log(aux_opciones_seleccionadas);
                            for(let l=0; l<aux_opciones_seleccionadas.length; l++) {
                              if (Number(aux_opciones_seleccionadas[l]) == 1) {
                                //console.log("suma");
                                aux_pregunta_cas_alt[3+l*2]= aux_pregunta_cas_alt[3+l*2] + 1;
                              }
                            }
                          }
                        }

                        //dividendo para sacar porcentajes

                        for(let k=1; k<aux_pregunta_cas_alt.length; k++) {
                          if (typeof aux_pregunta_cas_alt[k] == "number" && num_respuestas_pregunta != 0) {
                            aux_pregunta_cas_alt[k] = aux_pregunta_cas_alt[k]/num_respuestas_pregunta * 100;
                          }
                        }

                        
                        //console.log("lista preguntas casillas alternativas POST SUMA");
                        //console.log(aux_pregunta_cas_alt);

                        this.preguntas_casillas_alternativas_respuestas.push(aux_pregunta_cas_alt);
                      }
                    }
                  }
                  //this.preguntas_abiertas_respuestas.push(aux_config_abiertas);
                }
                //console.log("preguntas_abiertas_respuestas");
                //console.log(this.preguntas_abiertas_respuestas);
                console.log("preguntas_casillas_alternativas_respuestas");
                console.log(this.preguntas_casillas_alternativas_respuestas);

                //DEFINIR PREGUNTAS A MOSTRAR SEGUN ID_CONFIG_PRACTICA

                //MOSTRANDO PREGUNTAS ABIERTAS
                /*
                for (let i=0; i<this.preguntas_abiertas_respuestas.length; i++) {
                  if (this.preguntas_abiertas_respuestas[i][0] == this.id_config_practica_mostrar) {
                    this.preguntas_mostrar.push(this.preguntas_abiertas_respuestas[i]);
                  }
                }
                */
                
                for (let i=0; i<this.preguntas_casillas_alternativas_respuestas.length; i++) {
                  if (this.preguntas_casillas_alternativas_respuestas[i][0] == this.id_config_practica_mostrar) {
                    this.preguntas_mostrar.push(this.preguntas_casillas_alternativas_respuestas[i]);
                  }
                }
                

                console.log("preguntas_mostrar");
                console.log(this.preguntas_mostrar);

                console.log(this.AUX_config_practicas)

              } // fin complete
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
    for (let i=0; i<this.preguntas_casillas_alternativas_respuestas.length; i++) {
      if (this.preguntas_casillas_alternativas_respuestas[i][0] == this.id_config_practica_mostrar) {
        this.preguntas_mostrar.push(this.preguntas_casillas_alternativas_respuestas[i]);
      }
    }
  }

  isNumber(val: any){ return typeof val === 'number'; }

  largo_arreglo(arg: any) {
    return arg.length;
  }

  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }
}
