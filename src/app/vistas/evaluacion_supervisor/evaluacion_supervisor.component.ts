import { Component } from '@angular/core';
import { SupervisorService } from '../../servicios/supervisor/supervisor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router"
import * as $ from 'jquery';

@Component({
  selector: 'evaluacion_supervisor',
  templateUrl: './evaluacion_supervisor.component.html',
  styleUrls: ['./evaluacion_supervisor.component.css']
})
export class EvaluacionComponent {

  id_estudiante = 1;
  id_config_practica = 1;
  pregunta_actual = 1;
  constructor(private service: SupervisorService, private _snackbar: MatSnackBar, private router: Router) {

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

  send() {
    let pregunta1 = (document.getElementById("respuesta1") as HTMLInputElement)?.value;
    let pregunta2 = (document.getElementById("respuesta2") as HTMLInputElement)?.value;
    let evaluacion = +(document.querySelector('input[name="respuesta3"]:checked') as HTMLInputElement)?.value;
    let response = {};
    this.service.sendAnswer(this.id_estudiante, this.id_config_practica, { pregunta1, pregunta2 }, evaluacion).subscribe({
      next: (data: any) => {
        response = { ...response, ...data }
        if (data.status == 200) {
          this._snackbar.open("Respuestas enviadas", "Cerrar", {
            duration: 10000,
            panelClass: ['green-snackbar']
          });
        } else {
          this._snackbar.open("Enviando sus respuestas...", "Cerrar", {
            duration: 4000,
            panelClass: ['red-snackbar']
          });
        }
      },
      error: (error: any) => {
        console.log(error);
        this._snackbar.open("Error al enviar las respuestas", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        console.log(response)
        this.router.navigate(['/'])
      }
    });

  }
}
