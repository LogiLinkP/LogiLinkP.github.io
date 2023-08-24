import { Component, OnInit, Input} from '@angular/core';
import { GestionarService } from '../../servicios/alumno/gestionar_practica.service';
import { ObtenerDatosService } from '../../servicios/alumno/obtener_datos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-iniciar-practica',
  templateUrl: './iniciar-practica.component.html',
  styleUrls: ['./iniciar-practica.component.scss']
})

export class IniciarPracticaComponent implements OnInit{
  @Input() id_estudiante = -1
  @Input() nombre_practica: string = ""
  @Input() id_usuario = -1
  id_config_practica = -1
  config_practica: any = []
  cantidades: number[] = []
  modalidades: string[] = []

  correo_encargado: string = "";

  respuesta:any = [];

  constructor(private service: GestionarService, private service2: ObtenerDatosService,
              private _snackBar: MatSnackBar, private route:ActivatedRoute, private router: Router,
              private service_noti: NotificacionesService, private service_obtener: DataUsuarioService,
              private datetime: DatePipe) {}

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

    if(modalidad == "" || cantidad == "" || nombre_supervisor == "" || correo_supervisor == "" || nombre_empresa == "" || rut_empresa == "" || fecha_inicio == ""){
      this._snackBar.open("Debe llenar todos los campos", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
      return
    }

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

                this.service.buscar_encargados().subscribe({
                  next: (data: any) => {
                    aux = { ...aux, ...data }
                  },
                  error: (error: any) => console.log(error),
                  complete: () => {
                    console.log("encargados encontrados")
                    //seleccionar el primer encargado
                    let id_encargado = aux.body[0].id
                    console.log("ID DE ENCARGADO", id_encargado)

                    this.service_obtener.obtener_encargado(aux.body[0].id_usuario).subscribe({
                      next:(data:any) => {
                        this.respuesta = {...this.respuesta, ...data};
                      },
                      error:(error:any) => {
                        console.log(error);
                        return;
                      },
                      complete:() => {
                        this.correo_encargado = this.respuesta.body.correo;
                      }
                    })

                    this.service.registrar_practica(this.id_estudiante, this.id_config_practica, 
                                                    fecha_inicio, id_empresa, id_supervisor, id_encargado).subscribe({
                      next: (data: any) => {
                        aux = { ...aux, ...data }
                      },
                      error: (error: any) => {
                        // use snackbar to show error
                        console.log(error)
                        this._snackBar.open("Error al iniciar practica", "Cerrar", {
                          panelClass: ['red-snackbar'],
                          duration: 3000
                        });
                      },
                      complete: () => {
                        let fecha: any = this.datetime.transform((new Date), 'MM/dd/yyyy h:mm:ss');
                        let texto: string = "El estudiante "+ this.id_estudiante + " ha comenzado una nueva práctica";
                        console.log("Ahora a mandar la notificación");
                        
                        this.service_noti.postnotificacion(this.id_usuario, {fecha, texto}, this.correo_encargado);
                        let inscripcion_string = "";
                        if (aux.status == 200) {
                          inscripcion_string = "?inscripcion_success=success";
                        } else{
                          inscripcion_string = "?inscripcion_success=error";
                        }         
                        let newUrl = this.router.url.split("?")[0];
                        newUrl += inscripcion_string;
                        window.location.href = newUrl;
                      }
                    });
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
    if(this.cantidades.length > 0){
      if(this.cantidades[0] != null){
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
  }

}
