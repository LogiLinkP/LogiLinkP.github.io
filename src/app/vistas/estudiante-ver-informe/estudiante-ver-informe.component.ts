import { Component } from '@angular/core';
import { FragmentosService } from '../../servicios/fragmentos/fragmentos.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InformeService } from '../../servicios/informe/informe.service';
import * as dayjs from 'dayjs'
dayjs().format()
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

@Component({
  selector: 'app-estudiante-ver-informe',
  templateUrl: './estudiante-ver-informe.component.html',
  styleUrls: ['./estudiante-ver-informe.component.scss']
})
export class EstudianteVerInformeComponent {
  id_practica: number;
  id_informe: number;
  fragmentos: any;
  pares_pregunta_respuesta: any[];
  fecha_informe: any;

  constructor(private route: ActivatedRoute, private _snackBar: MatSnackBar, private informeService: InformeService) {
    this.id_practica = parseInt(this.route.snapshot.url[1].path);
    this.id_informe = parseInt(this.route.snapshot.url[2].path);
    let data: any = {};
    this.informeService.get_informe_preguntas(this.id_informe).subscribe({
      next: (_data: any) => {
        data = { ...data, ..._data };
      }, complete: () => {
        let informe = data.body;
        if (!informe) {
          this.showSnackbar();
          return;
        }
        console.log(informe.fecha.replace("T", " ").replace("Z", ""))
        this.fecha_informe = dayjs(informe.fecha, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY");
        let respuestas = informe.key;
        let preguntas: any[] = informe.config_informe.pregunta_informes;


        for (let i = 0; i < preguntas.length; i++) {

          if (preguntas[i].tipo_respuesta != "abierta" && respuestas[preguntas[i].id] != null) {
            let opciones = preguntas[i].opciones.split(";;");
            let respuesta = respuestas[preguntas[i].id].split(",");
            if (respuesta.length != opciones.length) {
              console.log("Error en la respuesta, el largo no coincide con el de las opciones de la pregunta");
              return;
            }
            let respuestas_traducidas = "";
            for (let j = 0; j < opciones.length; j++) {
              if (respuesta[j] == "1") {
                respuestas_traducidas += opciones[j] + ", ";
              }
            }
            respuestas_traducidas = respuestas_traducidas.slice(0, -2);
            console.log(respuestas_traducidas);
            respuestas[preguntas[i].id] = respuestas_traducidas;
          }
        }


        this.pares_pregunta_respuesta = preguntas.map((pregunta: any) => {
          return [
            pregunta.enunciado,
            respuestas[pregunta.id]
          ]
        });
      }, error: (err: any) => {
        this.showSnackbar();
      }
    });
        

  }

  showSnackbar(message: string = "Se ha producido un error, por favor vuelva más tarde",
    action: string = "Cerrar", panelClass: string = 'red-snackbar') {
    this._snackBar.open(message, action, {
      panelClass: [panelClass],
      duration: 3000
    });
  }

}
