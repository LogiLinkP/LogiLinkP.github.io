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
    const id_practica = parseInt(this.route.snapshot.url[1].path); //obtener el id del estudiante de la URL (DEBERÍA SER EL ID DE LA PRÁCTICA)

    this.service.obtener_practica(id_practica).subscribe({
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
