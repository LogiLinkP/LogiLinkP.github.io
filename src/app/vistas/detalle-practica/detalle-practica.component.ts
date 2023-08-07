import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetallePracticaService } from 'src/app/servicios/encargado/detalle-practica.service';

@Component({
  selector: 'app-detalle-practica',
  templateUrl: './detalle-practica.component.html',
  styleUrls: ['./detalle-practica.component.css']
})
export class DetallePracticaComponent {

  practica: any = {};

  constructor(private service: DetallePracticaService, private _snackBar: MatSnackBar) {
    let respuesta: any = {};
    this.service.obtener_detalle_practica().subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        this.practica = [];
        this._snackBar.open("Error al solicitar datos", "Cerrar", {
          duration: 10000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        this.practica = respuesta.body;
      }
    });
  }

  ngOnInit() {
  }
}
