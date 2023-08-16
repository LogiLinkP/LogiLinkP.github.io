import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-configuracion-practica-existente',
  templateUrl: './configuracion-practica-existente.component.html',
  styleUrls: ['./configuracion-practica-existente.component.scss']
})
export class ConfiguracionPracticaExistenteComponent {
  rutas = environment;
  name: string;
  config: any;

  constructor(private service: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute) {
    let respuesta: any = {};
    let id_config = parseInt(this.route.snapshot.url[1].path);

    this.service.obtenerConfigPorId(id_config).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        this._snackBar.open("Error al buscar configuracion de practica", "Cerrar", {
          duration: 3000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        this.config = respuesta.body;
        console.log("Esto es lo que se quiere mandar", this.config);
      }
    });
  }
}