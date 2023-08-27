import { Component, OnInit } from '@angular/core';
import { GestionarService } from '../../servicios/alumno/gestionar_practica.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import { SupervisorService } from 'src/app/servicios/supervisor/supervisor.service';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';


@Component({
  selector: 'app-finalizacion',
  templateUrl: './finalizacion.component.html',
  styleUrls: ['./finalizacion.component.scss']
})
export class FinalizacionComponent {
  id_estudiante: number = -1;
  id_practica: number = -1;
  private sub: any;
  estudiante: any = {};
  practica: any = {};

  estado_config: string = "";

  correo_encargado: string= "";

  constructor(private service: GestionarService, private serviceEstudiante: ObtenerDatosService,private serviceSupervisor: SupervisorService, 
              private activated_route: ActivatedRoute, private _snackBar: MatSnackBar, private router: Router,
              private service_obtener: DataUsuarioService, private service_noti: NotificacionesService) {
    this.sub = this.activated_route.params.subscribe(params => {
      this.id_estudiante = +params['id']; // (+) converts string 'id' to a number
      this.id_practica = +params['n'];
    });
  }

  ngOnInit() {
    let respuesta : any = [];
    this.serviceEstudiante.obtener_practica(this.id_estudiante).subscribe({
      next:(data:any) =>{
        respuesta = {...respuesta, ...data};
      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        this.service_obtener.obtener_encargado(respuesta.body.id_encargado).subscribe({
          next:(data:any) => {
            respuesta = {...respuesta, ...data};
          },
          error:(error:any) => {
            console.log(error);
            return;
          },
          complete:()=> {
            this.correo_encargado = respuesta.body.correo;
            this.estado_config = respuesta.body.config;
          }
        })
      }
    })
  }

  finalizar() {
    let resultado: any = {};
    this.service.finalizar_practica(this.id_estudiante, this.id_practica, "Finalizada").subscribe(
      {
        next: data => {
          resultado = { ...resultado, ...data };
        },
        error: error => {
          this._snackBar.open("Se ha producido un error interno (Finalizar practica)", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 3000
          });
        },
        complete: () => {
          this._snackBar.open("Estado de Práctica Actualizado", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 3000
          })
          //obtener datos del estudiante
          this.serviceEstudiante.obtener_estudiante(this.id_estudiante).subscribe(
            {
              next: (data:any) => {
                resultado = { ...resultado, ...data };
              },
              error: (error:any) => {
                this._snackBar.open("Se ha producido un error interno (Obtener Alumno)", "Cerrar", {
                  panelClass: ['red-snackbar'],
                  duration: 3000
                });
              },
              complete: () => {
                this.estudiante = resultado.body;
                resultado = {};
                //console.log("alumno",this.alumno);
                this.serviceEstudiante.obtener_practica(this.id_estudiante).subscribe(
                  {
                    next: (data:any) => {
                      resultado = { ...resultado, ...data };
                    },
                    error: (error:any) => {
                      this._snackBar.open("Se ha producido un error interno (Obtener practica)", "Cerrar", {
                        panelClass: ['red-snackbar'],
                        duration: 3000
                      });
                    },
                    complete: () => {
                      let correo_encargado:string = this.practica.correo_encargado;
                      let id_usuario_encargado:number = this.practica.id_encargado;
                      this.practica = resultado.body;
                      resultado = {};
                      console.log("practica",this.practica.correo_supervisor);
                      console.log("estudiante",this.estudiante.nombre);
                      console.log("supervisor",this.practica.nombre_supervisor);
                      this.serviceSupervisor.enviarLink(this.practica.id, this.practica.correo_supervisor,this.practica.nombre_supervisor,this.estudiante.nombre).subscribe(
                        {
                          next: (data:any) => {
                            resultado = { ...resultado, ...data };
                          },
                          error: (error:any) => {
                            console.log("enviar mail error",error);

                            this._snackBar.open("Se ha producido un error interno", "Cerrar", {
                              panelClass: ['red-snackbar'],
                              duration: 3000
                            });
                          },
                          complete: () => {
                            let respuesta:any = [];
                            this.service_noti.postnotificacion(id_usuario_encargado, "El alumno" + this.id_estudiante + " ha finalizado su práctica y desea su revisión", correo_encargado, this.estado_config).subscribe({
                              next:(data:any) => {
                                respuesta = {...respuesta, ...data};
                              },
                              error:(error:any) => {
                                console.log(error);
                                return;
                              },
                              complete:() => {
                                console.log("Notificación de finalización enviada con éxito");
                              }
                            })
                            this._snackBar.open("Solicitud Ingresada Correctamente", "Cerrar", {
                              panelClass:['red-snackbar'],
                              duration:3000
                            });
                            console.log("Correo enviado");
                            const newUrl = this.router.url + "?finalizacion_success=success";
                            window.location.href = newUrl;
                          }
                        }
                      );                      
                    }
                  }
                );
              }
            }
          );          
        }
      }
    );
  }
}
