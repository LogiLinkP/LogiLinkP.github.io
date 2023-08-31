import { Component, OnInit, ViewChild, Input , ElementRef, Injectable } from '@angular/core';
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

import jsPDF from 'jspdf';
//import pdfMake from 'pdfmake/build/pdfmake';
//import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import e from 'express';

//import { jsPDF } from "jspdf"; 


@Component({
  selector: 'app-detalle-practica',
  templateUrl: './detalle-practica.component.html',
  styleUrls: ['./detalle-practica.component.css']
})
export class DetallePracticaComponent implements OnInit {
  //@ViewChild(DataTableDirective, { static: false })

  //@ViewChild('content', { static: false }) el!: ElementRef;

  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('pdfTable2') pdfTable2: ElementRef;

  //window.jsPDF = this.window.jspdf.jsPDF;

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

  /*
  downloadAsPDF(){
    console.log("generando pdf")
    let pdf = new jsPDF('l', 'pt', 'a3');

    const pdfTable = this.pdfTable2.nativeElement;

    pdf.html(this.pdfTable2.nativeElement, {
      callback: (doc) => {
        doc.save("resumen.pdf");
      }
    });
    //console.log(pdfTable.innerHTML)
    //var html = htmlToPdfmake(pdfTable.innerHTML);

    //const documentDefinition = { content: html };
    
    //let PDF_doc: any = { documentDefinition };
    
  }
  */

  
  
  generar_pdf_resumen(){

    let pdf = new jsPDF();

    //console.log(this.id_estudiante)
    pdf.setFontSize(20);
    console.log(this.practica)

    pdf.text("Resumen " + this.practica.modalidad.config_practica.nombre, 15, 20);
    pdf.setFontSize(15);
    pdf.text(String(this.practica.estudiante.usuario.nombre), 15, 35);
    pdf.text("Resultado de práctica: " + this.practica.estado, 15, 45);
    pdf.text("Correo: " + this.practica.estudiante.usuario.correo, 15, 55);
    pdf.text("Empresa: " + this.practica.empresa.nombre_empresa,15, 65);
    pdf.text("Supervisor: " + this.practica.supervisor.nombre, 15, 75);
    pdf.text("Correo supervisor: " + this.practica.supervisor.correo, 15, 85);
    
    //borrar desde caracter T en adelante de la fecha
    let fecha_inicio = this.practica.fecha_inicio.split("T")[0];
    let fecha_termino = this.practica.fecha_termino.split("T")[0];
  
    pdf.text("Fecha de inicio: " + fecha_inicio, 15, 95);
    pdf.text("Fecha de término: " + fecha_termino, 15, 105);
    //pdf.text("hola", 200, 20);

    pdf.text("Informes del alumno: ", 15, 120);

    pdf.setFontSize(13);

    console.log(this.practica.informes[0])
    console.log(this.practica.informes[0].key)

    console.log(Object.values(this.practica.informes[0].key).length)

    let keys = Object.keys(this.practica.informes[0].key)

    let linea_actual = 0

    let continuar_desde = 130

    for (let i = 0; i < keys.length; i++) {

      var informe = String(this.practica.informes[0].key[keys[i]])
      var palabras_informe = informe.split(" ")
      //var lista_cantidad_palabras = []
      //var cantidad_caracteres = 0
      //var cantidad_palabras = 0

      var lista_aux = []

      var aux_string = "- "
      for (let x = 0; x < palabras_informe.length; x++) {

        //console.log(aux_string)
        if (x%10 == 0 && x != 0){
          aux_string += (palabras_informe[x] + " ")
          lista_aux.push(aux_string)
          aux_string = ""
        }
        else if(x == palabras_informe.length - 1){
          aux_string += (palabras_informe[x] + " ")
          lista_aux.push(aux_string)
        }

        else{
          aux_string += (palabras_informe[x] + " ")
        }
      }

      console.log(lista_aux)


      for (let j = 0; j < lista_aux.length; j++) {
        if (130 + i*5 + linea_actual*10 > 260){
          pdf.addPage()
          continuar_desde = 20
          linea_actual = 0
        }
        pdf.text(lista_aux[j], 15, continuar_desde + i*5 + linea_actual*10);
        linea_actual += 1
      }


      //pdf.text("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", 15, 260);

      /*
      //cantidad de palabras antes de llegar a 90 caracteres
      for (let j = 0; j < palabras_informe.length; j++) {
        if (cantidad_caracteres + palabras_informe[j].length > 90) {
          lista_cantidad_palabras.push(cantidad_palabras)
          cantidad_palabras = 1
          cantidad_caracteres = palabras_informe[j].length
        }
        else {
          cantidad_caracteres += palabras_informe[j].length
          cantidad_palabras += 1
        }
      }

      console.log(lista_cantidad_palabras)
      var cantidad_palabras = 0
      var iter_lista_cantidad_palabras = 0
      var informe_aux = ""
      for(let k = 0; k<palabras_informe.length; k++){
        if (cantidad_palabras = lista_cantidad_palabras[iter_lista_cantidad_palabras]){
          pdf.text(informe_aux, 15, 130 + i*10);
          cantidad_palabras = 0
          informe_aux = ""
          iter_lista_cantidad_palabras += 1
        }
        else{
          informe_aux += palabras_informe[k]
          cantidad_palabras += 1
        }
      }
      */

      //dividir por espacios
      
      /*
      palabras_informe[0] = " - " + palabras_informe[0]
      var cantidad_caracteres = 0
      for(let j =0; j<palabras_informe.length; j++){
        cantidad_caracteres += palabras_informe[j].length
        if(cantidad_caracteres < 90){
          pdf.text(palabras_informe[j], 15, 130 + i*10);
        }else{
          pdf.text(palabras_informe[j], 15, 140 + i*10);
          
        }
      }
      */
      //pdf.text(" - " + String(this.practica.informes[0].key[keys[i]]), 15, 130 + i*10);
    }


    pdf.save("resumen.pdf");
    
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
