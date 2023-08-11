import { Component, OnInit} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import {ActivatedRoute} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-up-informe',
  templateUrl: './up-informe.component.html',
  styleUrls: ['./up-informe.component.css']
})

export class UpInformeComponent implements OnInit{
  id_alumno: number = -1;
  alumno:any = []
  practica: any = [];
  config_practica: any = [];
  permitir_finalizacion: boolean = true;

  link_finalizacion = ""

  constructor(private service: ObtenerDatosService, private router: ActivatedRoute, private _snackBar: MatSnackBar) {
    this.router.params.subscribe(params => {this.id_alumno = +params['id'];});
  }

  ingresarInforme(){
    let respuesta: any = {};
    let key = (document.getElementById("informe") as HTMLInputElement).value;
    let horas = (document.getElementById("horas") as HTMLInputElement).valueAsNumber;
    let horas_actuales = this.practica.horas;


    if (Number.isNaN(horas)){
      horas = 0;
    }
    if (Number.isNaN(horas_actuales)){
      horas_actuales = 0;
    }

    let horas_nuevas = horas_actuales + horas;

    console.log("id_practica:",this.practica.id);
    console.log("casilla horas:",horas);
    console.log("cantidad horas en base de datos:",horas_actuales);
    console.log("cantidad a ingresar en bd:",horas_nuevas);

    //actualizar horas
    
    this.service.actualizar_hora(this.practica.id, horas_nuevas).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
        console.log("Respuesta actualizar horas:",data);
      },
      error: (error: any) => console.log("Error en actualizar hora:",error),  
      complete: () => {
        let id_config_informe = 1;
        console.log("Ingresar informe");
        this.service.ingresar_informe(this.practica.id, key, id_config_informe).subscribe({
          next: (data: any) => {
            respuesta = { ...respuesta, ...data }
            console.log("Respuesta ingresar informe:",data);
          },
          error: (error: any) => console.log("Error en ingresar informe:",error),
          complete: () => {
            this._snackBar.open("Informe Ingresado","Cerrar",{
              panelClass: ['red-snackbar'],
              duration: 3000
            })
            window.location.reload();
          }
    });
      }
    });
  }

  ngOnInit() {
    let respuesta: any = {};
    this.service.obtener_alumno(this.id_alumno).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.alumno = respuesta.body;
        this.link_finalizacion = "/alumno/"+this.alumno.id+"/finalizacion/1";
      }
    });
    
    this.service.obtener_practica(this.id_alumno).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.practica = respuesta.body;

        this.service.obtener_config_practica(this.practica.id_config_practica).subscribe({
          next: (data: any) => {
            respuesta = { ...respuesta, ...data }
          },
          error: (error: any) => console.log(error),
          complete: () => {
            this.config_practica = respuesta.body;

            this.service.obtener_informes(this.practica.id).subscribe({
              next: (data: any) => {
                respuesta = { ...respuesta, ...data }
              },
              error: (error: any) => console.log(error),
              complete: () => {
                console.log("largo respuesta:",respuesta.body.length);
                console.log("num_informes:",this.config_practica.num_informes);
                console.log("horas_config_practica:",this.config_practica.cantidad_horas);
                console.log("horas_practica:",this.practica.horas);
                if(this.config_practica.num_informes <= respuesta.body.length && this.config_practica.cantidad_horas <= this.practica.horas){
                  this.permitir_finalizacion = false;
                }
                
              }   
            });
          }   
        });

        
      }
    });   
  }
}
