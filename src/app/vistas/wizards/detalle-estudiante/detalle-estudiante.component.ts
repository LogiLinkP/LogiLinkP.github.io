import { Component, AfterViewInit } from '@angular/core';
import Shepherd from 'shepherd.js';

@Component({
  selector: 'app-detalle-estudiante',
  templateUrl: './detalle-estudiante.component.html',
  styleUrls: ['./detalle-estudiante.component.scss']
})
export class DetalleEstudianteComponent {

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
    const titulo = 'Guía de detalles de práctica';


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
        text: ['En esta sección usted podrá ver la información detallada de la práctica del estudiante.'],
      },
      {
        attachTo: {
          element: "#datos_generales",
          on: 'bottom'
        },
        buttons: botones,
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Tales como: Datos sobre la empresa y la práctica.']
      },
      {
        attachTo: {
          element: "#acciones",
          on: 'bottom'
        },
        buttons: botones,
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Acciones importantes.']
      },
      {
        attachTo: {
          element: "#info_general",
          on: 'bottom'
        },
        buttons: botones,
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Información general de la práctica.']
      },
      {
        attachTo: {
          element: "#informes",
          on: 'bottom'
        },
        buttons: botones,
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Informes realizados por el estudiante.']
      },
      {
        attachTo: {
          element: "#archivos",
          on: 'bottom'
        },
        buttons: botones,
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Documentos solicitados al estudiante y junto a la opción de descargarlos si fueron subidos a la plataforma.']
      },
      {
        attachTo: {
          element: "#evaluacion",
          on: 'bottom'
        },
        buttons: botones,
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Las evaluaciones del supervisor en caso de estar disponibles.']
      },
      {
        attachTo: {
          element: "#resena",
          on: 'bottom'
        },
        buttons: botones,
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Las respuestas del supervisor en caso de estar disponibles.']
      },
      {
        attachTo: {
          element: "#consistencias",
          on: 'bottom'
        },
        buttons: botones,
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Los textos más relevantes del estudiante y del supervisor.']
      },
      {
        id: 'end',
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
            classes: 'shepherd-button-success',
            text: 'Finalizar Tour',
            action: () => {
              window.location.href = "/practicas";
            }
          }
        ],
        cancelIcon: {
          enabled: true
        },
        highlightClass: 'highlight',
        title: titulo,
        text: ['Gracias por preferir praxus. No dude en volver a consultar la guía en caso de dudas.']
      }
    ]);
    tour.start();
  }
}
