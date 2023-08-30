import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss']
})
export class ImportModalComponent {
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
          console.log("error:", error);
        },
        complete: () => {
          //console.log("respuesta:", respuesta.body)
          if (respuesta.body.length > 0) {
              for (let i = 0; i < respuesta.body.length; i++) {
                  //si es que no es la planilla
                  if (respuesta.body[i].nombre != "configBase") {
                      //this.practicas_creadas.push(respuesta.body[i])
                      this.configs_nombres.push(respuesta.body[i].nombre)
                  }
              }
              //console.log("nombres:",this.configs_nombres)
          }
        }
      });
    }
}
