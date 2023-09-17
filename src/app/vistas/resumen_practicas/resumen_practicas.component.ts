import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GetDetallesAlumnoService } from '../../servicios/encargado/resumen_practicas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";
import { DetallePracticaService } from 'src/app/servicios/encargado/detalle-practica.service';
import { NULL } from 'sass';


@Component({
  selector: 'resumen_practicas',
  templateUrl: './resumen_practicas.component.html',
  styleUrls: ['./resumen_practicas.component.scss'],
  encapsulation: ViewEncapsulation.None // para poder customizar el mat-tooltip
})
export class TablaComponent {
  rutas = environment;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  practicas: any = [];
  notas_promedio: any = [];

  texto_consistencia_informe: string = "Indica qué tan relacionados están los informes del\n" +
    "estudiante con lo que escribió su supervisor.\n" +
    "Para más información, haga click en el botón.";

  texto_consistencia_evaluacion: string = "Indica qué tan relacionada está la evaluación escrita del\n" +
    "supervisor, con las notas que este mismo le haya puesto.\n" +
    "Para más información, haga click en el botón.";

  texto_interpretacion_nota: string = "Texto que ayuda a entender qué significa el puntaje\n" +
    "de consistencia evaluación obtenido.\n";

  texto_interpretacion_informes: string = "Texto que ayuda a entender qué significa el puntaje\n" +
    "de consistencia informes obtenido.\n";

  texto_indice_repeticion: string = "Es un valor que indica qué tanto contenido de los informes es texto repetido\n" +
    "Para más información, haga click en el botón.";

  texto_promedio_evaluacion: string = "Es un valor que indica en promedio las aptitudes del estudiante evaluadas por el supervisor";

  
  constructor(private service: GetDetallesAlumnoService, private _snackBar: MatSnackBar,
              private router: Router, private practi_service: DetallePracticaService) {
    //console.log("ESTE ES EL COMPONENTE ENCARGADO");

    this.dtOptions = {
      language: {
        url: 'assets/localisation/es-es.json'
      },
      drawCallback: () => {
        //console.log(this.practicas);
      }
    };

    let respuesta: any = {};
    this.service.full_estudiante_practicas().subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        this.practicas = [];
        this._snackBar.open("Error al solicitar datos", "Cerrar", {
          duration: 10000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        this.practicas = respuesta.body.map((alumno: any) => {
          alumno.consistencia_nota = alumno.consistencia_nota ? `${Math.round(100 * alumno.consistencia_nota)}%` : "—";
          alumno.consistencia_informe = alumno.consistencia_informe ? `${Math.round(100 * alumno.consistencia_informe)}%` : "—";
          alumno.nota_evaluacion = alumno.nota_evaluacion ? alumno.nota_evaluacion : "—";
          alumno.interpretacion_nota = alumno.interpretacion_nota ? alumno.interpretacion_nota : "—";
          alumno.interpretacion_informe = alumno.interpretacion_informe ? alumno.interpretacion_informe : "—";
          return alumno;
        });

        for (var item of this.practicas){
          this.practi_service.obtener_practica(item.id).subscribe({
            next: (data: any) => {
              respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
              this._snackBar.open("Error al solicitar datos de práctica", "Cerrar", {
                duration: 10000,
                panelClass: ['red-snackbar']
              });
            },
            complete: () => {
              let evaluaciones = respuesta.body.respuesta_supervisors
              console.log(evaluaciones);

              if(evaluaciones.length == 0){
                console.log("Entra al if")
                this.notas_promedio.push("0")
              }
              else{
                console.log("Entra al else")
                for (var val of evaluaciones){
                  let nota_promedio = 0;
                  let prom = 0;
                  let temp: any = [];

                  if (val.pregunta_supervisor.enunciado == "Seleccione las características que mejor describen al practicante"){
                    if(val.pregunta_supervisor.opciones.indexOf(";;") != -1){
                      temp = val.respuesta.split(",");
                      for(var n in temp){
                        nota_promedio += Number(n);
                        prom += 1;
                      } 
                      nota_promedio = nota_promedio/prom
                      this.notas_promedio.push(nota_promedio.toString())   
    
                    }  
                    else{
                      this.notas_promedio.push("0")
                    }
                  }
                }  
              }
            }
          });
        }

        /*
        for (var item of this.practicas){
          let temp: any = [];
          let nota_promedio = 0;
          let prom = 0;
          for(var item2 of item){
            if ((item2.pregunta_supervisor.tipo_respuesta == "casillas") && (item2.pregunta_supervisor.opciones != NULL)){
              if(item2.pregunta_supervisor.opciones.indexOf(";;") != -1){
                this.aptitudes_practica.push(item2.pregunta_supervisor.opciones.split(";;"))
                temp = item2.respuesta.split(",");
                for(var n in temp){
                  nota_promedio += Number(n);
                  prom += 1;
                }       
              }                              
            }
          }

          this.notas_aptitudes.push(temp);
          this.notas_promedio.push(nota_promedio/prom)
          
        }
        */
        
        this.rerender();
      }
    });
  }
  rerender(): void {
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
  }

  redirecting() {
    this.router.navigate(["/consistencia"])
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
