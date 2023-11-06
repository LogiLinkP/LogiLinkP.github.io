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
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.scss']
})
export class InformeComponent {
  id_practica: number;
  id_informe: number;
  fragmentos: any;
  pares_pregunta_respuesta: any[];
  fecha_informe: any;

  constructor(private route: ActivatedRoute, private fragmentosService: FragmentosService, private _snackBar: MatSnackBar, private informeService: InformeService) {
    this.id_practica = parseInt(this.route.snapshot.url[1].path);
    this.id_informe = parseInt(this.route.snapshot.url[2].path);
    let resp: any = {}
    this.fragmentosService.update_fragmentos_practica(this.id_practica).subscribe({
      next: (data: any) => {
        resp = { ...resp, ...data };
      },
      error: (err: any) => {
        this.showSnackbar();
      }, complete: () => {
        if (!resp.body || !resp.body.informes) {
          this.showSnackbar();
          return;
        }
        this.fragmentos = resp.body.informes[this.id_informe];
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
            this.pares_pregunta_respuesta = preguntas.map((pregunta: any) => {
              let frag = this.fragmentos[pregunta.id][0].fragmento;
              let res_splitted = respuestas[pregunta.id].split(" ");

              return [
                pregunta.enunciado,
                [
                  res_splitted.slice(0, frag[0]).join(" ").trim(),
                  res_splitted.slice(frag[0], frag[1] + 1).join(" ").trim(),
                  res_splitted.slice(frag[1] + 1, res_splitted.length).join(" ").trim()
                ]
              ];
            });
          }, error: (err: any) => {
            this.showSnackbar();
          }
        });
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
