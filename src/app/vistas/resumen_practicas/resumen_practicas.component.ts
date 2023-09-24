import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GetDetallesAlumnoService } from '../../servicios/encargado/resumen_practicas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import { NULL } from 'sass';
import { DetallePracticaService } from 'src/app/servicios/encargado/detalle-practica.service';


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

  carreras: any = [];

  carrera_encargado: number = -1;

  usuario:any = []
  encargado: any = []

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

  promedio_notas: any = [];
  
  constructor(private service: GetDetallesAlumnoService, private _snackBar: MatSnackBar,
              private router: Router, private practi_service: DetallePracticaService) {
    //console.log("ESTE ES EL COMPONENTE ENCARGADO");

    this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
    this.encargado = this.usuario.encargado;

    this.carrera_encargado = this.encargado.id_carrera;

    this.dtOptions = {
      language: {
        url: 'assets/localisation/es-es.json'
      },
      drawCallback: () => {
        //console.log(this.practicas);
      }
    };

    let respuesta: any = {};
    this.service.full_estudiante_practicas(this.carrera_encargado).subscribe({
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
        let temppracticas:any = [];

        for (let alumno of respuesta.body){
          if (alumno.modalidad.config_practica.id_carrera == this.carrera_encargado && alumno.modalidad.config_practica.id_carrera != null){
          temppracticas.push(alumno);
          }
        }
        console.log(temppracticas);

        this.practicas = temppracticas.map((alumno: any) => {

          alumno.consistencia_nota = alumno.consistencia_nota ? `${Math.round(100 * alumno.consistencia_nota)}%` : "—";
          alumno.consistencia_informe = alumno.consistencia_informe ? `${Math.round(100 * alumno.consistencia_informe)}%` : "—";
          alumno.nota_evaluacion = alumno.nota_evaluacion ? alumno.nota_evaluacion : "—";
          alumno.interpretacion_nota = alumno.interpretacion_nota ? alumno.interpretacion_nota : "—";
          alumno.interpretacion_informe = alumno.interpretacion_informe ? alumno.interpretacion_informe : "—";
          
          /*alumno ={... alumno, carrera: this.carreras[Math.floor(Math.random() * this.carreras.length)]}
          console.log(alumno);
          if (alumno.carrera != "Ingeniería Civil en Informática"){
            let index: number = this.practicas.indexOf(alumno);
            this.practicas.splice(index, 1);
          }
          */
          return alumno;
        });

        console.log(this.practicas)

        for (let item of this.practicas){
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
              let evaluaciones = respuesta.body.respuesta_supervisors.filter((respuesta_supervisor: any) => {
                return !isNaN(respuesta_supervisor.respuesta);
              });
    
              let nota_promedio = 0;
              let prom = 0;
              for (var val of evaluaciones){
                if (val.pregunta_supervisor.tipo_respuesta == "evaluacion"){
                  nota_promedio += Number(val.respuesta);
                  prom += 1;
                }
              }
              console.log(nota_promedio)
              nota_promedio = nota_promedio/prom
              this.promedio_notas.push(nota_promedio)
            }
          });
        }
        console.log(this.promedio_notas);
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
