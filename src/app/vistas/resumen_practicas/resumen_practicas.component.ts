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
  temp_notas:any = []
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
          let iditem = item.id
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
              
              if(evaluaciones.length == 0){
                this.temp_notas.push([iditem, 0])
              }
              else{
                let find = -1
                for (var val of evaluaciones){
                  let nota_promedio = 0;
                  let prom = 0;
                  let temp: any = [];

                  if (val.pregunta_supervisor.enunciado == "Seleccione las características que mejor describen al practicante"){
                    find = 1
                    temp = val.respuesta.split(",");
                    for(var n in temp){
                      nota_promedio += Number(n);
                      prom += 1;
                    } 
                    nota_promedio = nota_promedio/prom
                    this.temp_notas.push([iditem, nota_promedio])  
                    continue
                  }
                }
                if (find == -1){
                  this.temp_notas.push([iditem, 0])
                } 
              }
              this.temp_notas.sort(function(a:any, b:any){
                return a[0] - b[0];
              })
              this.notas_promedio = [];
              for (let item2 of this.temp_notas){
                this.notas_promedio.push(item2[1])
              }
            }
          });
        }     
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
