import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlagioService } from "../../servicios/plagio/plagio.service";

@Component({
  selector: 'app-plagios',
  templateUrl: './plagios.component.html',
  styleUrls: ['./plagios.component.scss']
})
export class PlagiosComponent {

  id_practica: number;
  lista_plagios: Array<any> = [];

  constructor(private route: ActivatedRoute, private plagioService: PlagioService) {
    this.id_practica = parseInt(this.route.snapshot.url[1].path);
    let res_plagio: any = {};
    plagioService.get_plagio_por_pratica_con_informes(this.id_practica).subscribe({
      next: (data: any) => {
        res_plagio = { ...res_plagio, ...data };
      }, error: (error: any) => { },
      complete: () => {
        if (res_plagio.status != 200 || !res_plagio.body) return;
        this.lista_plagios = res_plagio.body;
        console.log(this.lista_plagios)
      }
    })
  }
}
