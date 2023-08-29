import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'jquery';
import { DetallePracticaService } from 'src/app/servicios/encargado/detalle-practica.service';
import { SetDetallesAlumnoService } from '../../servicios/encargado/decision.service';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { ResumenService } from 'src/app/servicios/resumen/resumen.service';


@Component({
  selector: 'app-detalle-practica',
  templateUrl: './detalle-practica.component.html',
  styleUrls: ['./detalle-practica.component.css']
})
export class DetallePracticaComponent implements OnInit {
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
  doc_str = "documento";
  doc_extra_str = "documento_extra";
  hay_resumen: boolean = false;

  botones_habilitados: boolean = false;

  id_estudiante: number = -1
  correo_estudiante: string = "";

  constructor(private service: DetallePracticaService, private service2: SetDetallesAlumnoService,
    private _snackBar: MatSnackBar, private route: ActivatedRoute,
    private service_obtener: DataUsuarioService, private service_resumen: ResumenService) {

    this.route.params.subscribe(params => { this.id_estudiante = +params['id']; });

    this.dtOptions = {
      language: {
        url: 'assets/localisation/es-es.json'
      },
      drawCallback: () => {
        //console.log(this.documentos);
      }
    };

    let respuesta: any = {};

    let id_practica = parseInt(this.route.snapshot.url[1].path); //obtener el id de práctica de la url

    if (!isNaN(id_practica)) {

      //console.log("id_practica: ", id_practica);
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
          this.check_resumen();


          if (this.practica.estado == environment.estado_practica.evaluada ||
            this.practica.estado == environment.estado_practica.aprobada ||
            this.practica.estado == environment.estado_practica.reprobada) {
            this.botones_habilitados = true;
          }

          this.documentos = this.practica.documentos;
          this.documento_extras = this.practica.documento_extras;
          this.informes = this.practica.informes;
          // considerar como evaluaciones todas las respuestas que tengan un tipo_respuesta que sea un número
          this.evaluaciones = this.practica.respuesta_supervisors.filter((respuesta_supervisor: any) => {
            return !isNaN(respuesta_supervisor.respuesta);
          });
          //console.log("evaluaciones: ", this.evaluaciones);
          // considerar como respuestas todas las que sean strings
          this.respuestas_supervisor = this.practica.respuesta_supervisors.filter((respuesta_supervisor: any) => {
            return isNaN(respuesta_supervisor.respuesta);
          });
          //console.log("respuestas_supervisor: ", this.respuestas_supervisor);
        }
      }); // fin request para obtener la practica  
    }
  }

  generar_resumen() {
    let bot_inf = document.getElementById("boton_informe") as HTMLElement;
    let bot_sup = document.getElementById("boton_supervisor") as HTMLElement;
    bot_inf.innerHTML = `
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `
    bot_sup.innerHTML = `
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    `

    let data: any = {};
    if (this.practica.resumen && Object.keys(this.practica.resumen).length > 0) {
      this.hay_resumen = true;
      return;
    }
    this.service_resumen.get_informe_preguntas(this.practica.id).subscribe({
      next: (_data: any) => {
        data = { ...data, ..._data };
      },
      complete: () => {
        console.log(data.body)
        if (!data.body) {
          this._snackBar.open("Error al solicitar resumen, por favor vuelva más tarde", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 3000
          });
          return;
        }
        if (!data.body.informe)
          data.body.informe = "No hay información disponible."
        if (!data.body.supervisor)
          data.body.supervisor = "No hay información disponible."
        this.practica.resumen = data.body;
        this.hay_resumen = true;
      },
      error: (error: any) => {
        console.error(error);
        this._snackBar.open("Error al solicitar resumen, por favor vuelva más tarde", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 3000
        });
      }
    });
  }

  check_resumen() {
    if (!this.practica.resumen) {
      this.hay_resumen = false;
      return
    }
    if (Object.keys(this.practica.resumen).length == 2) {
      this.hay_resumen = true;
    } else if (Object.keys(this.practica.resumen).length == 1) {
      if (!this.practica.resumen.informe) {
        this.practica.resumen.informe = "No hay información disponible."
      } else {
        this.practica.resumen.supervisor = "No hay información disponible."
      }
      this.hay_resumen = true;
    } else {
      this.hay_resumen = false;
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
    let respuesta: any = [];
    this.service_obtener.obtener_estudiante(this.id_estudiante).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data };
      },
      error: (error: any) => {
        //console.log(error);
        return;
      },
      complete: () => {
        this.correo_estudiante = respuesta.body.correo;
      }
    })
  }


  isDataEmpty(data: any): boolean {
    return Object.keys(data).length === 0 && data.constructor === Object;
  }

  aprobar(id_usuario: number, id_estudiante: number, id_modalidad: number, aprobacion: 0 | 1) {
    let respuesta: any = {}
    this.service2.aprobar_practica(id_estudiante, id_modalidad, aprobacion).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        if (respuesta.status == 200) {
          this._snackBar.open("Práctica actualizada", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
          });
        } else {
          this._snackBar.open("Se ha producido un error", "Cerrar", {
            panelClass: ['red-snackbar']
          });
        }
        window.location.reload()
      }
    });

  }

  descargar_documento(documento_id: string, solicitud_tipo: string) {
    // abrir nueva pestaña con url de descarga, que es url_backend (sacada desde el env) + /documentos/ + documento_key
    if (solicitud_tipo == "documento") {
      window.open(environment.url_back + "/documento/download?id=" + documento_id, "_blank");
    }
    else {
      window.open(environment.url_back + "/documento_extra/download?id=" + documento_id, "_blank");
    }
  }

  mostrar_informe(informe_id: string) {
    // abrir una ventana modal que muestre el texto del informe
    let informe = this.informes.find((informe: any) => informe.id == informe_id);
    if (informe) {
      // abrir una ventana pequeña que muestre el texto del informe dentro de un textarea
      let ventana = window.open("", "_blank", "width=800,height=400");
      if (!ventana) {
        alert("Por favor, deshabilite el bloqueador de ventanas emergentes para este sitio");
      }
      else {
        ventana.document.write("<textarea style='width: 100%; height: 100%; resize: none; border: none;'>" + informe.key + "</textarea>");
      }
    }
  }



}
