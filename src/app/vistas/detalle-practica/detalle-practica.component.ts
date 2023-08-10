import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'jquery';
import { DetallePracticaService } from 'src/app/servicios/encargado/detalle-practica.service';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detalle-practica',
  templateUrl: './detalle-practica.component.html',
  styleUrls: ['./detalle-practica.component.css']
})
export class DetallePracticaComponent implements OnInit{
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  practica: any = {};
  documentos: any = [];
  documento_extras: any = [];
  informes: any = [];
  evaluaciones: any = [];
  respuestas_supervisor: any = [];

  constructor(private service: DetallePracticaService, private _snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.dtOptions = {
      language: {
        url: 'assets/localisation/es-es.json'
      },
      drawCallback: () => {
        console.log(this.documentos);
      }
    };
    
    let respuesta: any = {};
    
    let id_practica = parseInt(this.route.snapshot.url[1].path); //obtener el id de práctica de la url

    if(!isNaN(id_practica)) {
      
      console.log("id_practica: ", id_practica);
      //====REQUEST para obtener la practica (con el estudiante, config_practica y otras tablas)====//
      this.service.obtener_practica(id_practica).subscribe({
        next: (data: any) => {
          respuesta = { ...respuesta, ...data }
        },
        error: (error: any) => {
          this.practica = [];
          this._snackBar.open("Error al solicitar datos de práctica", "Cerrar", {
            duration: 10000,
            panelClass: ['red-snackbar']
          });
        },
        complete: () => {
          this.practica = respuesta.body;
          this.documentos = this.practica.documentos;
          this.documento_extras = this.practica.documento_extras;
          this.informes = this.practica.informes;
          // make this.evaluaciones = all the this.practica.respuesta_supervisor where this.practica.respuesta_supervisor.tipo_respuesta is a number
          this.evaluaciones = this.practica.respuesta_supervisor.filter((respuesta_supervisor: any) => {
            return !isNaN(respuesta_supervisor.tipo_respuesta);
          }
          );
          // make this.respuestas_supervisor = all the this.practica.respuesta_supervisor where this.practica.respuesta_supervisor.tipo_respuesta is a string
          this.respuestas_supervisor = this.practica.respuesta_supervisor.filter((respuesta_supervisor: any) => {
            return isNaN(respuesta_supervisor.tipo_respuesta);
          }
          );
        }
      }); // fin request para obtener la practica  
    } 
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
