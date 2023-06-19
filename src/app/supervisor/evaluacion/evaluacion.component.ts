import { Component } from '@angular/core';
import { SupervisorService } from '../../Servicios/supervisor.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent {

  id_estudiante = 1;
  id_config_practica = 1;
  constructor(private service: SupervisorService, private _snackbar: MatSnackBar) {

  }

  send() {
    let pregunta1 = (document.getElementById("respuesta1") as HTMLInputElement)?.value;
    let pregunta2 = (document.getElementById("respuesta2") as HTMLInputElement)?.value;
    let pregunta3 = (document.querySelector('input[name="respuesta3"]:checked') as HTMLInputElement)?.value;
    let response = {};
    this.service.sendAnswer(this.id_estudiante, this.id_config_practica, { pregunta1, pregunta2, pregunta3 }).subscribe(
      (data: any) => {
        response = { ...response, ...data }
        if (data.status == 200) {
          this._snackbar.open("Respuestas enviadas", "Cerrar", {
            duration: 2000,
            panelClass: ['green-snackbar']
          });
        } else {
          this._snackbar.open("Error al enviar las respuestas", "Cerrar", {
            duration: 2000,
            panelClass: ['red-snackbar']
          });
        }
      },
      (error: any) => {
        console.log(error);
        this._snackbar.open("Error al enviar las respuestas", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
      },
      () => console.log(response));

  }
}