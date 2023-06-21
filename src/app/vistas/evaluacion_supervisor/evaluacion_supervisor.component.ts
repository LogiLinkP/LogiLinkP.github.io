import { Component } from '@angular/core';
import { SupervisorService } from '../../servicios/supervisor/supervisor.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'evaluacion_supervisor',
  templateUrl: './evaluacion_supervisor.component.html',
  styleUrls: ['./evaluacion_supervisor.component.css']
})
export class EvaluacionComponent {

  id_estudiante = 1;
  id_config_practica = 1;
  constructor(private service: SupervisorService, private _snackbar: MatSnackBar) {

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
      error: (error: any) => {
        console.log(error);
        this._snackbar.open("Error al enviar las respuestas", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => console.log(response)
    });

  }
}
