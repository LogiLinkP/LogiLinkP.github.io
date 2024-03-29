import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FragmentosService } from '../../servicios/fragmentos/fragmentos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fragmentos',
  templateUrl: './fragmentos.component.html',
  styleUrls: ['./fragmentos.component.scss']
})
export class FragmentosComponent {
  id_practica: number;
  fragmentos_informes: string[][] = [];
  fragmentos_supervisor: string[][];

  getFragmentosTexto() {
    let data: any = {}
    this.fragmentosService.get_fragmentos_practica(this.id_practica).subscribe({
      next: (response: any) => {
        data = { ...data, ...response };
      }, complete: () => {
        if (data.status != 200 || !data.body) {
          this._snackBar.open("Error al recolectar los fragmentos", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 3000
          });
          return;
        }
        console.log(data.body)

        if (data.body.informes) {
          let aux_informes: string[][] = [];
          let [idx_frag_informes, textos_informe] = data.body.informes;
          for (let i = 0; i < idx_frag_informes.length; i++) {
            let palabras = textos_informe[i].split(" ");
            let frags = idx_frag_informes[i]
            frags.forEach((frag: any) => {
              let part1 = palabras.slice(0, frag.fragmento[0]).join(" ");
              let part2 = palabras.slice(frag.fragmento[0], frag.fragmento[1] + 1).join(" ");
              let part3 = palabras.slice(frag.fragmento[1] + 1, palabras.length).join(" ");
              aux_informes.push([part1, part2, part3])
            });
          }
          this.fragmentos_informes = aux_informes;
        }

        if (data.body.supervisor) {
          let aux_supervisor: string[][] = [];
          let [idx_frag_supervisor, textos_supervisor] = data.body.superevisor;
          for (let i = 0; i < idx_frag_supervisor.length; i++) {
            let palabras = textos_supervisor[i].split(" ");
            let frags = idx_frag_supervisor[i]
            frags.forEach((frag: any) => {
              let part1 = palabras.slice(0, frag.fragmento[0]).join(" ");
              let part2 = palabras.slice(frag.fragmento[0], frag.fragmento[1] + 1).join(" ");
              let part3 = palabras.slice(frag.fragmento[1] + 1, palabras.length).join(" ");
              aux_supervisor.push([part1, part2, part3])
            });
          }
          this.fragmentos_supervisor = aux_supervisor;
        }


      }, error: (error) => {
        if (error.status == 404) {
          return;
        }
        this._snackBar.open("Error al recolectar los fragmentos", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 3000
        });
      }
    });
  }
  constructor(private route: ActivatedRoute, private fragmentosService: FragmentosService, private _snackBar: MatSnackBar) {
    this.id_practica = parseInt(this.route.snapshot.url[1].path);
    this.getFragmentosTexto()
  }

}
