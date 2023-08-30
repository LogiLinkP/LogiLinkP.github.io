import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GetDetallesAlumnoService } from '../../servicios/encargado/resumen_practicas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'resumen_practicas',
  templateUrl: './resumen_practicas.component.html',
  styleUrls: ['./resumen_practicas.component.scss'],
  encapsulation: ViewEncapsulation.None // para poder customizar el mat-tooltip
})
export class TablaComponent{
  rutas = environment;
  
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  practicas: any = [];

  texto_consistencia_informe: string = "Indica qué tan relacionados están los informes del\n"+
                                       "estudiante con lo que escribió su supervisor.\n"+
                                       "Para más información, haga click en el botón.";

  texto_consistencia_evaluacion: string = "Indica qué tan relacionada está la evaluación escrita del\n"+
                                          "supervisor, con las notas que este mismo le haya puesto.\n"+
                                          "Para más información, haga click en el botón.";

  texto_interpretacion_nota: string = "Texto que ayuda a entender qué significa el puntaje\n"+
                                      "de consistencia evaluación obtenido.\n"+
                                      "Para más información, haga click en el botón.";
                                  
  texto_interpretacion_informes: string = "Texto que ayuda a entender qué significa el puntaje\n"+
                                          "de consistencia informes obtenido.\n"+
                                          "Para más información, haga click en el botón.";

  constructor(private service: GetDetallesAlumnoService, private _snackBar: MatSnackBar) {
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
        //console.log("practicas: ", this.practicas);
        this.rerender();
      }
    });
  }
  rerender(): void {
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
