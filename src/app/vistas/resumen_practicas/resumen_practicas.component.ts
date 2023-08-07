import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GetDetallesAlumnoService } from '../../servicios/encargado/resumen_practicas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';


@Component({
  selector: 'resumen_practicas',
  templateUrl: './resumen_practicas.component.html',
  styleUrls: ['./resumen_practicas.component.scss',
              '../../../assets/css/dataTables.bootstrap4.min.css']
})
export class TablaComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  alumnos: any = [];

  constructor(private service: GetDetallesAlumnoService, private _snackBar: MatSnackBar) {
    this.dtOptions = {
      language: {
        url: 'assets/localisation/es-es.json'
      },
      drawCallback: () => {
        console.log(this.alumnos);
      }
    };

    let respuesta: any = {};
    this.service.full_estudiante_practicas().subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        this.alumnos = [];
        this._snackBar.open("Error al solicitar datos", "Cerrar", {
          duration: 10000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        this.alumnos = respuesta.body.map((alumno: any) => {
          alumno.consistencia_nota = alumno.consistencia_nota ? `${Math.round(100 * alumno.consistencia_nota)}%` : "—";
          alumno.consistencia_informe = alumno.consistencia_informe ? `${Math.round(100 * alumno.consistencia_informe)}%` : "—";
          alumno.nota_evaluacion = alumno.nota_evaluacion ? alumno.nota_evaluacion : "—";
          alumno.interpretacion_nota = alumno.interpretacion_nota ? alumno.interpretacion_nota : "—";
          alumno.interpretacion_informe = alumno.interpretacion_informe ? alumno.interpretacion_informe : "—";
          return alumno;
        });
        this.rerender();
      }
    });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(0);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
  }
}
