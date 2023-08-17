import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-barra-lateral-encargado',
  templateUrl: './barra-lateral-encargado.component.html',
  styleUrls: ['./barra-lateral-encargado.component.scss']
})
export class BarraLateralEncargadoComponent {
  rutas = environment;
  name: string;
  practicas_creadas: any = [];
  configs_nombres: any = [];

  constructor(private service: BarraLateralService, private _snackBar: MatSnackBar) {
    let respuesta: any = {};

    this.service.obtenerPracticasCreadas().subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        this._snackBar.open("Error al buscar practicas creadas", "Cerrar", {
          duration: 5000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        for (let i = 0; i < respuesta.body.length; i++) {
          if (!this.configs_nombres.includes(respuesta.body[i].nombre)) {
            this.practicas_creadas.push(respuesta.body[i])
            this.configs_nombres.push(respuesta.body[i].nombre)
          }
        }
        console.log("practicas creadas:", this.practicas_creadas)
        console.log("configs nombres:", this.configs_nombres)
      }
    });
  }

  set_practicas_creadas() {
    this.practicas_creadas.push({name: this.name, id: this.practicas_creadas.length});
  }
}