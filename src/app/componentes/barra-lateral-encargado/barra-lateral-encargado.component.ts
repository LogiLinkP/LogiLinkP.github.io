import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComunicacionService } from 'src/app/servicios/com-componentes/comunicacion.service';
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
        this.practicas_creadas = respuesta.body;
      }
    });
  }

  set_practicas_creadas() {
    this.practicas_creadas.push({name: this.name, id: this.practicas_creadas.length});
  }
}