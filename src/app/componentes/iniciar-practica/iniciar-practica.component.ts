import { Component, OnInit} from '@angular/core';
import { GestionarService } from '../../servicios/alumno/gestionar_practica.service';
import { ObtenerDatosService } from '../../servicios/alumno/obtener_datos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-iniciar-practica',
  templateUrl: './iniciar-practica.component.html',
  styleUrls: ['./iniciar-practica.component.css']
})

export class IniciarPracticaComponent implements OnInit{

  id_alumno = -1
  config_practica: any = []
  horas: number[] = []

  constructor(private service: GestionarService, private service2: ObtenerDatosService, private _snackBar: MatSnackBar, private route:ActivatedRoute, private router: Router) {
    this.route.params.subscribe((params:any) => {
      this.id_alumno = +params.id
    });
    let respuesta: any = {};
    let id_config_practica = 1; //HARDCODEADO - debería obtener todas las distintas horas en la tabla de config_practica, segun la modalidad que se haya elegido
    this.service2.obtener_config_practica(id_config_practica).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.config_practica = respuesta.body
        this.horas.push(respuesta.body.cantidad_horas)
        // hacer que el dropdown de horas se actualice al obtener la respuesta dela query
        var dropdown = document.getElementById("cantidad_horas")
        if (dropdown != null){
          var content = this.horas.map((hora) => {
            return `<option value="${hora}">${hora}</option>`
          })
          dropdown.innerHTML = content.join('')
        }

      }
    });
  }

 enviar(){

  
    let nombre_supervisor = (document.getElementById("nombre_supervisor") as HTMLInputElement).value
    let correo_supervisor = (document.getElementById("correo_supervisor") as HTMLInputElement).value
    let nombre_empresa = (document.getElementById("nombre_empresa") as HTMLInputElement).value
    let rut_empresa = (document.getElementById("rut_empresa") as HTMLInputElement).value
    let fecha_inicio = (document.getElementById("fecha_inicio") as HTMLInputElement).value
    let cantidad_horas = (document.getElementById("cantidad_horas") as HTMLInputElement).value

    //console.log(this.id_estudiante)



    let aux:any = {} 

    this.service.registrar_practica(this.id_alumno, this.config_practica.id, nombre_supervisor, correo_supervisor, nombre_empresa, rut_empresa, fecha_inicio).subscribe(
      {
        next: (data: any) => {
          aux = {...aux, ...data}
          console.log("DATA EN NEXT:",data)
        },
        error: error => {
          console.log("ERROR EN REGISTRAR PRACTICA",error)
        },
        complete: () => {
          console.log("Esto en complietetware:",aux)
          this._snackBar.open("Práctica iniciada", "Cerrar", {
            panelClass: ['green-snackbar']
          });
          window.location.reload()
        }
      }
    )
  } 

  ngOnInit() {
    
  }
}
