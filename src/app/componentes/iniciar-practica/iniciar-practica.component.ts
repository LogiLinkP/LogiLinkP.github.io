import { Component } from '@angular/core';
import { GestionarService } from '../../servicios/alumno/gestionar_practica.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-iniciar-practica',
  templateUrl: './iniciar-practica.component.html',
  styleUrls: ['./iniciar-practica.component.css']
})
export class IniciarPracticaComponent {

  id_estudiante = -1
  id_config_practica = -1

  constructor(private service: GestionarService, private _snackBar: MatSnackBar, private route:ActivatedRoute) {
    this.route.params.subscribe((params:any) => {
      console.log(params)
      this.id_estudiante = +params.id
      this.id_config_practica = 1
    })
   }

  enviar(){


    let nombre_supervisor = (document.getElementById("nombre_supervisor") as HTMLInputElement).value
    let correo_supervisor = (document.getElementById("correo_supervisor") as HTMLInputElement).value
    let nombre_empresa = (document.getElementById("nombre_empresa") as HTMLInputElement).value
    let rut_empresa = (document.getElementById("rut_empresa") as HTMLInputElement).value
    let fecha_inicio = (document.getElementById("fecha_inicio") as HTMLInputElement).value
    let cantidad_horas = (document.getElementById("cantidad_horas") as HTMLInputElement).value

    //console.log(this.id_estudiante)

    /*
    console.log(nombre_supervisor)
    console.log(correo_supervisor)
    console.log(nombre_empresa)
    console.log(rut_empresa)
    console.log(fecha_inicio)
    console.log(cantidad_horas)
    */

    let aux:any = {} 

    this.service.registrar_practica(this.id_estudiante, this.id_config_practica, nombre_supervisor, correo_supervisor, nombre_empresa, rut_empresa, fecha_inicio).subscribe(
      {
        next: data => {
          aux = {...aux, ...data}
          console.log("")
        },
        error: error => {
          console.log(error)
        },
        complete: () => {
          console.log(aux)
          this._snackBar.open("Práctica iniciada", "Cerrar", {
            panelClass: ['green-snackbar']
          });
        }
      }
    )
  }

    //HARDCODEADO
    horas = [360]

}
