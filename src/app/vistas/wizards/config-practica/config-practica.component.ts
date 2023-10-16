import { Component } from '@angular/core';
import { Router } from "@angular/router";
import Shepherd from 'shepherd.js';

@Component({
  selector: 'app-config-practica',
  templateUrl: './config-practica.component.html',
  styleUrls: ['./config-practica.component.scss']
})
export class ConfigPracticaComponent {

    constructor(private router: Router) { }

    ngAfterViewInit() {
        const tour = new Shepherd.Tour({
          useModalOverlay: true,
          defaultStepOptions: {
            classes: 'shadow-md bg-purple-dark',
            scrollTo: true,
            cancelIcon: {
              enabled: true
            },
          }
        });
        const botones = [{ classes: 'shepherd-button-secondary', text: 'Salir', action: tour.cancel },
                        { classes: 'shepherd-button-primary', text: 'Atrás', action: tour.back },
                        { classes: 'shepherd-button-primary', text: 'Siguiente', action: tour.next }];

        const titulo = 'Guía configuración de prácticas';
    
        tour.addSteps([
          {
            id: 'intro',
            beforeShowPromise: function () {
              return new Promise(function (resolve) {
                setTimeout(function () {
                  window.scrollTo(0, 0);
                  resolve(1);
                }, 500);
              });
            },
            buttons: [
              { classes: 'shepherd-button-secondary', text: 'Salir', action: tour.cancel },
              { classes: 'shepherd-button-primary', text: 'Siguiente', action: tour.next }],
            cancelIcon: { enabled: true },
            highlightClass: 'highlight',
            title: titulo,
            text: ['Bienvenido a la configuración de prácticas.<br>Con esta guía usted aprenderá la información que Praxus ofrece para crear distintos formatos de práctica'],
          },
          {
            attachTo: { element: '#config-general', on: 'bottom' },
            buttons: [{ classes: 'shepherd-button-secondary', text: 'Salir', action: tour.cancel },
                    { classes: 'shepherd-button-primary', text: 'Atrás', action: tour.back },
                    { classes: 'shepherd-button-primary', text: 'Siguiente', action: ()=> { this.estado = "informe_avance"; tour.next();}}],
            highlightClass: 'highlight',
            title: titulo,
            text: ['Configuraciones generales de las prácticas que podrán elegir los alumnos, como el nombre, cantidad de horas y meses.'],
          },
          {
            beforeShowPromise: function () {
                return new Promise(function (resolve) {
                    if (document.getElementById("informe-avance")) {
                        return resolve(1);
                    }
                    const interval = setInterval(function() {
                        const element = document.getElementById('informe-avance');
                        if (element) {
                          clearInterval(interval);
                          return resolve(1);
                        }
                    }, 100);
                });
            },
            attachTo: { element: '#informe-avance', on: 'bottom' },
            buttons: [{ classes: 'shepherd-button-secondary', text: 'Salir', action: tour.cancel },
                    { classes: 'shepherd-button-primary', text: 'Atrás', action: ()=> { this.estado = "configuracion_general", tour.back();}},
                    { classes: 'shepherd-button-primary', text: 'Siguiente', action: ()=> { this.estado = "informe_final"; tour.next();}}],
            highlightClass: 'highlight',
            title: titulo,
            text: ['Esta sección solo aparecerá si se seleccionó la opción de informe de avance.<br>Aca se podrá agregar, editar y eliminar las preguntas que se le harán al estudiante en los informes de avance.'],
          },
          {
            beforeShowPromise: function () {
                return new Promise(function (resolve) {
                    if (document.getElementById("informe-final")) {
                        return resolve(1);
                    }
                    const interval = setInterval(function() {
                        const element = document.getElementById('informe-final');
                        if (element) {
                          clearInterval(interval);
                          return resolve(1);
                        }
                    }, 100);
                });
            },
            attachTo: { element: '#informe-final', on: 'bottom' },
            buttons: [{ classes: 'shepherd-button-secondary', text: 'Salir', action: tour.cancel },
            { classes: 'shepherd-button-primary', text: 'Atrás', action: ()=> { this.estado = "informe_avance", tour.back();}},
            { classes: 'shepherd-button-primary', text: 'Siguiente', action: ()=> { this.estado = "solicitud_documentos"; tour.next();}}],
            highlightClass: 'highlight',
            title: titulo,
            text: ['Esta sección solo aparecerá si se seleccionó la opción de informe final.<br>Aca se podrá agregar, editar y eliminar las preguntas que se le harán al estudiante en el informes final.'],
          },
          {
            beforeShowPromise: function () {
                return new Promise(function (resolve) {
                    if (document.getElementById("sol-doc")) {
                        return resolve(1);
                    }
                    const interval = setInterval(function() {
                        const element = document.getElementById('sol-doc');
                        if (element) {
                          clearInterval(interval);
                          return resolve(1);
                        }
                    }, 100);
                });
            },
            attachTo: { element: '#sol-doc', on: 'bottom' },
            buttons: [{ classes: 'shepherd-button-secondary', text: 'Salir', action: tour.cancel },
            { classes: 'shepherd-button-primary', text: 'Atrás', action: ()=> { this.estado = "informe_final", tour.back();}},
            { classes: 'shepherd-button-primary', text: 'Siguiente', action: ()=> { this.estado = "encuesta_final"; tour.next();}}],
            highlightClass: 'highlight',
            title: titulo,
            text: ['Aca podrá configurar el tipo de documentos que los alumnos deben subir antes de terminar la práctica.'],
          },
          {
            beforeShowPromise: function () {
                return new Promise(function (resolve) {
                    if (document.getElementById("encuesta-fin")) {
                        return resolve(1);
                    }
                    const interval = setInterval(function() {
                        const element = document.getElementById('encuesta-fin');
                        if (element) {
                          clearInterval(interval);
                          return resolve(1);
                        }
                    }, 100);
                });
            },
            attachTo: { element: '#encuesta-fin', on: 'bottom' },
            buttons: [{ classes: 'shepherd-button-secondary', text: 'Salir', action: tour.cancel },
            { classes: 'shepherd-button-primary', text: 'Atrás', action: ()=> { this.estado = "solicitud_documentos", tour.back();}},
            { classes: 'shepherd-button-primary', text: 'Siguiente', action: ()=> { this.estado = "aptitudes"; tour.next();}}],
            highlightClass: 'highlight',
            title: titulo,
            text: ['Estas son las preguntas que el estudiante deberá responder al finalizar la práctica.'],
          },
          {
            beforeShowPromise: function () {
                return new Promise(function (resolve) {
                    if (document.getElementById("aptitud")) {
                        return resolve(1);
                    }
                    const interval = setInterval(function() {
                        const element = document.getElementById('aptitud');
                        if (element) {
                          clearInterval(interval);
                          return resolve(1);
                        }
                    }, 100);
                });
            },
            attachTo: { element: '#aptitud', on: 'bottom' },
            buttons: [{ classes: 'shepherd-button-secondary', text: 'Salir', action: tour.cancel },
            { classes: 'shepherd-button-primary', text: 'Atrás', action: ()=> { this.estado = "encuesta_final", tour.back();}},
            { classes: 'shepherd-button-primary', text: 'Siguiente', action: ()=> { this.estado = "preguntas_supervisor"; tour.next();}}],
            highlightClass: 'highlight',
            title: titulo,
            text: ['Esta es una pregunta obligatoria que el supervisor contestará cuando el alumno termine su práctica. Usted debe ingresar las aptitudes que el supervisor tendrá que evaluar, como puntualidad, conocimiento, etc (del 1 al 5).'],
          },
          {
            beforeShowPromise: function () {
                return new Promise(function (resolve) {
                    if (document.getElementById("preg-supervisor")) {
                        return resolve(1);
                    }
                    const interval = setInterval(function() {
                        const element = document.getElementById('preg-supervisor');
                        if (element) {
                          clearInterval(interval);
                          return resolve(1);
                        }
                    }, 100);
                });
            },
            attachTo: { element: '#preg-supervisor', on: 'bottom' },
            buttons: [{ classes: 'shepherd-button-secondary', text: 'Salir', action: tour.cancel },
            { classes: 'shepherd-button-primary', text: 'Atrás', action: ()=> { this.estado = "aptitudes", tour.back();}},
            { classes: 'shepherd-button-primary', text: 'Siguiente', action: ()=> { this.estado = "fin_configuracion"; tour.next();}}],
            highlightClass: 'highlight',
            title: titulo,
            text: ['Estas son otras preguntas opcionales con las cuales el supervisor podrá evaluar al alumno.'],
          },
          {
            beforeShowPromise: function () {
                return new Promise(function (resolve) {
                    if (document.getElementById("fin")) {
                        return resolve(1);
                    }
                    const interval = setInterval(function() {
                        const element = document.getElementById('fin');
                        if (element) {
                          clearInterval(interval);
                          return resolve(1);
                        }
                    }, 100);
                });
            },
            attachTo: { element: '#fin', on: 'bottom' },
            buttons: [{ classes: 'shepherd-button-primary', text: 'Atrás', action: ()=> { this.estado = "preguntas_supervisor", tour.back();}},
            { classes: 'shepherd-button-primary', text: 'Finalizar', 
                action: () => {
                    window.location.href = "/configurar/blanco"
                }
            }],
            highlightClass: 'highlight',
            title: titulo,
            text: ['Una vez que se han configurado todas las opciones, se deben confirmar los cambios.'],
          }
        ]);
        tour.start();
    }

    currentRoute: string;
    importada: boolean = false;
    migracion_legal: boolean = true;
    config: any;
    ids_config_informe: number[] = [];
    flag: boolean = true;
    nombre_config: string | null; //parece que alguna veces se vuelve null y queda la caga

    displayedColumnsOpcionesPregunta = ["opcion_pregunta", "eliminar"]
    displayedColumnsHoras = ["opcion_horas", "eliminar"]
    displayedColumnsMeses = ["opcion_meses", "eliminar"]

    nombrePractica: string;
    cant_horas: number[] = [];
    cant_meses: number[] = [];
    horas: boolean;
    meses: boolean;
    frecuenciaInformes: string;
    informeFinal: string;

    aptitud: string;

    nombre_solicitud_documentos: string;
    descripcion_solicitud_documentos: string;
    tipo_solicitud_documentos: string;

    pregunta: string;
    tipo_pregunta: string;

    //decide que se muestra en el html
    estado: string = "configuracion_general";
    habilitarHoras: boolean = false;
    habilitarMeses: boolean = false;

    lista_aptitudes: string[] = [];

    lista_preguntas_avance: string[] = [];
    tipos_preguntas_avance: string[] = [];
    lista_opciones_preguntas_avance: string[] = [];

    lista_preguntas_final: string[] = [];
    tipos_preguntas_final: string[] = [];
    lista_opciones_preguntas_final: string[] = [];

    lista_preguntas_encuesta: string[] = [];
    tipos_preguntas_encuesta: string[] = [];
    lista_opciones_preguntas_encuesta: string[] = [];

    lista_preguntas_supervisor: string[] = [];
    tipos_preguntas_supervisor: string[] = [];
    lista_opciones_preguntas_supervisor: string[] = [];
    lista_fija_preguntas_supervisor: boolean[] = [];

    lista_nombre_solicitud_documentos: string[] = [];
    lista_descripcion_solicitud_documentos: string[] = [];
    lista_tipo_solicitud_documentos: string[] = [];

    avanzarDesdePreguntasAvance() {
        if (this.informeFinal == "si") {
            this.estado = "informe_final";
        }
        else {
            this.estado = "solicitud_documentos";
        }
        this.pregunta = "";
    }

    avanzarDesdePreguntasFinal() {
        this.estado = "solicitud_documentos";
    }

    avanzarDesdeSolicitudDocumentos() {
        this.estado = "encuesta_final";
    }

    avanzarDesdePreguntasEncuesta() {
        this.estado = "aptitudes";
    }

    avanzarDesdeAptitud() {
        this.estado = "preguntas_supervisor";
    }

    avanzarDesdePreguntasSupervisor() {
        this.estado = "fin_configuracion";
    }
}
