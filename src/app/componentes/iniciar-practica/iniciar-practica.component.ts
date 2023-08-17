import { Component, OnInit, Input} from '@angular/core';
import { GestionarService } from '../../servicios/alumno/gestionar_practica.service';
import { ObtenerDatosService } from '../../servicios/alumno/obtener_datos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-iniciar-practica',
  templateUrl: './iniciar-practica.component.html',
  styleUrls: ['./iniciar-practica.component.scss']
})

export class IniciarPracticaComponent implements OnInit{

  @Input() id_estudiante = -1
  @Input() nombre_practica: string = ""
  config_practica: any = []
  id_config_practica_seleccionada: number = -1
  cantidades: number[] = []
  modalidades: string[] = []

  constructor(private service: GestionarService, private service2: ObtenerDatosService, private _snackBar: MatSnackBar, private route:ActivatedRoute, private router: Router) {}

 enviar(){
    console.log("ENVIAR")
  
    let nombre_supervisor = (document.getElementById("nombre_supervisor"+this.nombre_practica) as HTMLInputElement).value
    let correo_supervisor = (document.getElementById("correo_supervisor"+this.nombre_practica) as HTMLInputElement).value
    let nombre_empresa = (document.getElementById("nombre_empresa"+this.nombre_practica) as HTMLInputElement).value
    let rut_empresa = (document.getElementById("rut_empresa"+this.nombre_practica) as HTMLInputElement).value
    let fecha_inicio = (document.getElementById("fecha_inicio"+this.nombre_practica) as HTMLInputElement).value

    console.log("ENVIAR2")

    console.log(this.id_estudiante)

    let aux:any = {} 

    this.service.registrar_practica(this.id_estudiante, this.id_config_practica_seleccionada, nombre_supervisor, correo_supervisor, nombre_empresa, rut_empresa, fecha_inicio).subscribe(
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
    let respuesta: any = {};
    
    console.log("En componente iniciar practica el nombre es:",this.nombre_practica)
    this.service2.obtener_config_practica(this.nombre_practica).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.config_practica = respuesta.body

        // iterar sobre config_practica y llenar el array de modalidades con config_practica.modalidad
        this.config_practica.forEach((element: any) => {
          this.modalidades.push(element.modalidad)
        });

        console.log("modalidades definidas para la practica",this.nombre_practica,this.modalidades)
      
        // hacer que el dropdown de modalidad se actualice al obtener la respuesta dela query
        var dropdown = document.getElementById("modalidad"+this.nombre_practica)
        
        // actualizar el dropdown de modalidad con el contenido de this.modalidades
        for (let i = 0; i < this.modalidades.length; i++) {
          var option = document.createElement("option")
          option.text = this.modalidades[i]
          option.value = this.modalidades[i]
          dropdown?.appendChild(option)
        }

      }
    });
  }

  actualizar_cantidades(modalidad:any){
    // actualizar el dropdown de cantidad segun la modalidad seleccionada

    // borrar el contenido del dropdown de cantidad
    var dropdown_cantidad = document.getElementById("cantidad"+this.nombre_practica)
    while (dropdown_cantidad?.firstChild) {
      dropdown_cantidad.removeChild(dropdown_cantidad.firstChild);
    }
    this.cantidades = []
    
    this.config_practica.forEach((element: any) => {
      if(element.modalidad == modalidad.target.value){
        this.cantidades.push(element.cantidad_tiempo)
      }
    });

    var dropdown_cantidad = document.getElementById("cantidad"+this.nombre_practica)
    
    // actualizar el dropdown de cantidad con el contenido de this.cantidades
    for (let i = 0; i < this.cantidades.length; i++) {
      //chequear si cantidades[i] es un numero
      if(isNaN(this.cantidades[i])){
        continue
      }
      var option = document.createElement("option")
      option.text = this.cantidades[i].toString()
      option.value = this.cantidades[i].toString()
      dropdown_cantidad?.appendChild(option)
    }
  }

}
