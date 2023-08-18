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
  id_config_practica = -1
  config_practica: any = []
  cantidades: number[] = []
  modalidades: string[] = []

  constructor(private service: GestionarService, private service2: ObtenerDatosService, private _snackBar: MatSnackBar, private route:ActivatedRoute, private router: Router) {}

 enviar(){
    // obtener los datos de los inputs
    let modalidad = (document.getElementById("modalidad"+this.nombre_practica) as HTMLInputElement).value
    let cantidad = (document.getElementById("cantidad"+this.nombre_practica) as HTMLInputElement).value

    let nombre_supervisor = (document.getElementById("nombre_supervisor"+this.nombre_practica) as HTMLInputElement).value
    let correo_supervisor = (document.getElementById("correo_supervisor"+this.nombre_practica) as HTMLInputElement).value
    let nombre_empresa = (document.getElementById("nombre_empresa"+this.nombre_practica) as HTMLInputElement).value
    let rut_empresa = (document.getElementById("rut_empresa"+this.nombre_practica) as HTMLInputElement).value
    let fecha_inicio = (document.getElementById("fecha_inicio"+this.nombre_practica) as HTMLInputElement).value

    let aux:any = {}


    this.service.buscar_config_practica(this.nombre_practica, modalidad, parseInt(cantidad)).subscribe({
      next: (data: any) => {
        aux = { ...aux, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        console.log("config_practica encontrada")
        this.id_config_practica = aux.body.id
        console.log("ID DE CONFIG PRACTICA", this.id_config_practica)

        // INICIO DE CREACION DE EMPRESA, SUPERVISOR Y PRACTICA
        this.service.registrar_empresa(nombre_empresa, rut_empresa).subscribe({
          next: (data: any) => {
            aux = { ...aux, ...data }
          },
          error: (error: any) => console.log("Error:",error),
          complete: () => {
            console.log("empresa registrada")
            // parse de body as json
            let id_empresa = aux.body.id
            console.log("ID DE EMPRESA", id_empresa)
    
            this.service.registrar_supervisor(nombre_supervisor, correo_supervisor).subscribe({
              next: (data: any) => {
                aux = { ...aux, ...data }
              },
              error: (error: any) => console.log(error),
              complete: () => {
                console.log("supervisor registrado")
                let id_supervisor = aux.body.id
                console.log("ID DE SUPERVISOR", id_supervisor)
    
                this.service.registrar_practica(this.id_estudiante, this.id_config_practica, 
                                                  fecha_inicio, id_empresa, id_supervisor, -1).subscribe({
                  next: (data: any) => {
                    aux = { ...aux, ...data }
                  },
                  error: (error: any) => console.log(error),
                  complete: () => {
                    console.log("practica registrada")
                    this._snackBar.open("Práctica registrada", "", {
                      duration: 3000,
                    });
                    window.location.reload();
                  }
                });
              }
            });
          }
        });
      }
    });
    // Crear empresa, supervisor y practica
    
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
