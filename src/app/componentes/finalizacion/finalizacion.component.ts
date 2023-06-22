import { Component, OnInit } from '@angular/core';
import { GestionarService } from '../../servicios/alumno/gestionar_practica.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router"
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import { SupervisorService } from 'src/app/servicios/supervisor/supervisor.service';


@Component({
  selector: 'app-finalizacion',
  templateUrl: './finalizacion.component.html',
  styleUrls: ['./finalizacion.component.css']
})
export class FinalizacionComponent {
  id_estudiante: number = -1;
  id_practica: number = -1;
  private sub: any;
  alumno: any = {};
  practica: any = {};

  constructor(private service: GestionarService, private serviceEstudiante: ObtenerDatosService,private serviceSupervisor: SupervisorService, private route: ActivatedRoute, private _snackBar: MatSnackBar, private router: Router) {
    this.sub = this.route.params.subscribe(params => {
      this.id_estudiante = +params['id']; // (+) converts string 'id' to a number
      this.id_practica = +params['n'];
    });
  }

  ngOnInit() {

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
          this._snackBar.open("Estado de práctica actualizado", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 3000
          })
          //obtener datos del estudiante
          this.serviceEstudiante.obtener_alumno(this.id_estudiante).subscribe(
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
                this.alumno = resultado.body;
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
                      this.practica = resultado.body;
                      resultado = {};
                      console.log("practica",this.practica.correo_supervisor);
                      console.log("alumno",this.alumno.nombre);
                      console.log("supervisor",this.practica.nombre_supervisor);
                      this.serviceSupervisor.enviarLink(this.practica.correo_supervisor,this.practica.nombre_supervisor,this.alumno.nombre).subscribe(
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
                            console.log("Correo enviado");
                            this.router.navigate(['/'])
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
