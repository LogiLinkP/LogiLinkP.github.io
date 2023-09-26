import { Component, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import Shepherd from 'shepherd.js';

@Component({
  selector: 'app-info-y-evaluacion-estudiante',
  templateUrl: './info-y-evaluacion-estudiante.component.html',
  styleUrls: ['./info-y-evaluacion-estudiante.component.scss']
})
export class InfoYEvaluacionEstudianteComponent {

  texto_consistencia_informe: string = "Indica qué tan relacionados están los informes del\n" +
    "estudiante con lo que escribió su supervisor.\n" +
    "Para más información, haga click en el botón.";

  texto_consistencia_evaluacion: string = "Indica qué tan relacionada está la evaluación escrita del\n" +
    "supervisor, con las notas que este mismo le haya puesto.\n" +
    "Para más información, haga click en el botón.";

  texto_interpretacion_nota: string = "Texto que ayuda a entender qué significa el puntaje\n" +
    "de consistencia evaluación obtenido.\n";

  texto_interpretacion_informes: string = "Texto que ayuda a entender qué significa el puntaje\n" +
    "de consistencia informes obtenido.\n";

  texto_indice_repeticion: string = "Es un valor que indica qué tanto contenido de los informes es texto repetido\n" +
    "Para más información, haga click en el botón.";

  texto_promedio_evaluacion: string = "Es un valor que indica en promedio las aptitudes del estudiante evaluadas por el supervisor";

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
    const botones = [
      {
        classes: 'shepherd-button-secondary',
        text: 'Salir',
        action: tour.cancel
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Atrás',
        action: tour.back
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Siguiente',
        action: tour.next
      }
    ];
    const titulo = 'Guía de evaluación de estudiante';


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
          {
            classes: 'shepherd-button-secondary',
            text: 'Salir',
            action: tour.cancel
          },
          {
            classes: 'shepherd-button-primary',
            text: 'Siguiente',
            action: tour.next
          }
        ],
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Bienvenido al sistema de Evaluación de Praxus.<br>Con esta guía usted aprenderá la información que Praxus ofrece para evaluar de mejor manera a los estudiantes.'],
      },
      {
        id: '1',
        attachTo: {
          element: '#dataTable',
          on: 'bottom'
        },
        buttons: botones,
        highlightClass: 'highlight',
        title: titulo,
        text: ['En esta tabla se muestra la información principal sobre la prácticas de los estudiantes.'],
      },
      {
        id: '2',
        attachTo: {
          element: '#dataTable',
          on: 'bottom'
        },
        buttons: botones,
        highlightClass: 'highlight',
        title: titulo,
        text: ['Datos importantes, como el nombre, rut y otros datos recolectados por nuestro sistema.'],
      },
      {
        attachTo: {
          element: '#infobox',
          on: 'bottom'
        },
        buttons: botones,
        highlightClass: 'highlight',
        title: titulo,
        text: ['Al posar el mouse sobre el botón de información, se desplegará una ventana con información sobre el dato de la columna.<br>Al hacer clic podrá ver información extendida sobre aquel dato.'],
      },
      {
        attachTo: {
          element: '#col_evaluar',
          on: 'bottom'
        },
        buttons: botones,
        highlightClass: 'highlight',
        title: titulo,
        text: ['Una vez la práctica haya sido evaluada, usted podrá revisar los antecedentes y decidir si aprueba o reprueba esta práctica.'],
      },
      {
        attachTo: {
          element: '#fila',
          on: 'bottom'
        },
        buttons: [
          {
            classes: 'shepherd-button-secondary',
            text: 'Salir',
            action: tour.cancel
          },
          {
            classes: 'shepherd-button-primary',
            text: 'Atrás',
            action: tour.back
          },
          {
            classes: 'shepherd-button-primary',
            text: 'Siguiente vista',
            action: () => {
              window.location.href = "/guias/detalle-estudiante";
            }
          }
        ],
        highlightClass: 'highlight',
        title: titulo,
        text: ['Al hacer clic en una fila usted podrá ver los detalles del estudiante.'],
      }
    ]);

    tour.start();
  }

  redirecting() {
    this.router.navigate(["/consistencia"])
  }
}
