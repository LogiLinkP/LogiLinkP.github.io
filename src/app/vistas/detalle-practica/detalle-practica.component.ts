import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetallePracticaService } from 'src/app/servicios/encargado/detalle-practica.service';
import { SetDetallesAlumnoService } from '../../servicios/encargado/decision.service';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { FragmentosService } from '../../servicios/fragmentos/fragmentos.service';
import { ResumenService } from 'src/app/servicios/resumen/resumen.service';

//import pdfMake from 'pdfmake/build/pdfmake';
//import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { jsPDF } from "jspdf"; 


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
  respuestas_supervisor: any = {};
  data_supervisor_rdy: boolean = false;
  doc_str = "documento";
  doc_extra_str = "documento_extra";
  fragmentos_sup: any = [];
  respuestas_sup_parsed: any = [];
  hay_resumen: boolean = false;
  horas_totales: number = 0;

  botones_habilitados: boolean = false;

  id_estudiante: number = -1
  correo_estudiante: string = "";

  constructor(private fragmentosService: FragmentosService, private service: DetallePracticaService, private service2: SetDetallesAlumnoService,
    private _snackBar: MatSnackBar, private route: ActivatedRoute,
    private service_obtener: DataUsuarioService, private service_resumen: ResumenService) {

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

          //console.log("ID_ESTUDIANTE",this.id_estudiante)

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
          this.get_fragmentos_sup(id_practica);
          this.correo_estudiante = this.practica.estudiante.usuario.correo;
          //console.log("respuestas_supervisor: ", this.respuestas_supervisor);
          for(let i=0; i<this.informes.length; i++){
            this.horas_totales += this.informes[i].horas_trabajadas;
          }

          for(let i=0; i<this.respuestas_supervisor.length; i++){
            if(this.respuestas_supervisor[i].pregunta_supervisor.tipo_respuesta != "abierta"){
              let opciones = this.respuestas_supervisor[i].pregunta_supervisor.opciones.split(";;");
              let respuestas = this.respuestas_supervisor[i].respuesta.split(",");
              let respuestas_traducidas = "";
              for(let j=0; j<opciones.length; j++){
                if(respuestas[j] == "1"){
                  respuestas_traducidas += opciones[j] + ", ";
                }          
              }              
              respuestas_traducidas = respuestas_traducidas.slice(0, -2);
              console.log(respuestas_traducidas);
              this.respuestas_supervisor[i].respuesta = respuestas_traducidas;
            }
          }
        }
      }); // fin request para obtener la practica  
    }
  }

  get_fragmentos_sup(id_practica: number) {
    let dataFrag: any = {};
    this.fragmentosService.update_fragmentos_practica(id_practica).subscribe({
      next: (data: any) => {
        dataFrag = { ...dataFrag, ...data };
      },
      error: (err: any) => { },
      complete: () => {
        if (!dataFrag.body || !dataFrag.body.supervisor) return;
        this.fragmentos_sup = dataFrag.body.supervisor
        console.log("fragmentos_sup!!", this.fragmentos_sup)
        this.respuestas_sup_parsed = this.respuestas_supervisor.map((resp: any) => {
          if (!(resp.id in this.fragmentos_sup)) {
            return [true, resp.pregunta_supervisor.enunciado, resp.respuesta]
          } else {
            let palabras = resp.respuesta.split(" ");
            return [
              false,
              resp.pregunta_supervisor.enunciado,
              [
                palabras.slice(0, this.fragmentos_sup[resp.id][0].fragmento[0]).join(" "),
                palabras.slice(this.fragmentos_sup[resp.id][0].fragmento[0], this.fragmentos_sup[resp.id][0].fragmento[1] + 1).join(" "),
                palabras.slice(this.fragmentos_sup[resp.id][0].fragmento[1] + 1, palabras.length).join(" ")
              ]
            ]
          }
        });
        this.data_supervisor_rdy = true;
        console.log(dataFrag.body);
        }
    });
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

  
  generar_pdf_resumen(){

    let pdf = new jsPDF();

    pdf.text("Resumen de práctica", 10, 10);
    pdf.save("resumen.pdf");

    /*
    console.log("generando pdf")
    let PDF_doc: any = {
      content: [
        {
          text: "Resumen de práctica"
        }
      ]
    };

    const pdf = pdfMake.createPdf(PDF_doc);
    pdf.open();
    */
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
