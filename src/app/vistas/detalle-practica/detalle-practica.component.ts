import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'jquery';
import { DetallePracticaService } from 'src/app/servicios/encargado/detalle-practica.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-practica',
  templateUrl: './detalle-practica.component.html',
  styleUrls: ['./detalle-practica.component.css']
})
export class DetallePracticaComponent {

  practica: any = {};
  usuario: any = {};

  constructor(private service: DetallePracticaService, private _snackBar: MatSnackBar, private route: ActivatedRoute) {
    let respuesta: any = {};
    
    //====REQUEST para obtener la practica (con el estudiante y config_practica)====//

    // Parse the url to get the last number after the last slash

    const id_estudiante = parseInt(this.route.snapshot.url[1].path);

    this.service.obtener_practica(id_estudiante).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        this.practica = [];
        this._snackBar.open("Error al solicitar datos de práctica", "Cerrar", {
          duration: 10000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        this.practica = respuesta.body;      }
    }); // fin request para obtener la practica    
  }

  ngOnInit() {
  }
}
