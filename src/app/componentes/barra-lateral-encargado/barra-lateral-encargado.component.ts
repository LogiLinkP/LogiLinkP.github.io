import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { RamosService } from 'src/app/servicios/encargado/ramos/ramos.service';
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
  ramos_creados: boolean = false;

  user: any = window.localStorage.getItem('auth-user');
  id_carrera: number = JSON.parse(this.user).userdata.encargado.id_carrera;

  constructor(private service: BarraLateralService, private _snackBar: MatSnackBar, private serviceRamos: RamosService) {
    
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
                if (respuesta.body[i].nombre != "configBase" && respuesta.body[i].activada == true) {
                    //this.practicas_creadas.push(respuesta.body[i])
                    this.configs_nombres.push(respuesta.body[i].nombre)
                }
            }
            //console.log("nombres:",this.configs_nombres)
        }
      }
    });

    this.serviceRamos.getRamos(this.id_carrera).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        this._snackBar.open("Error al buscar ramos creados", "Cerrar", {
          duration: 5000,
          panelClass: ['red-snackbar']
        });
        console.log("error:", error);
      },
      complete: () => {
        console.log("respuesta:", respuesta.body)
        if (respuesta.body.ramos != "" && respuesta.body.ramos != null) {
            this.ramos_creados = true;
        }
      }
    });

  }
}