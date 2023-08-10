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
  documentos_extra: any = [];

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
        }
      }); // fin request para obtener la practica  


      //====REQUEST para obtener los documentos de la práctica====//
      this.service.obtener_documentos(id_practica).subscribe({
        next: (data: any) => {
          respuesta = { ...respuesta, ...data }
        },
        error: (error: any) => {
          this.documentos = [];
          this._snackBar.open("Error al solicitar los documentos de la práctica", "Cerrar", {
            duration: 10000,
            panelClass: ['red-snackbar']
          });
        },
        complete: () => {
          console.log("documentos: ", respuesta.body);
          this.documentos = respuesta.body;
          this.rerender();
        }
      }); // fin request para obtener los documentos de la práctica

      
      //====REQUEST para obtener los documentos_extra de la práctica====//
      this.service.obtener_documentos_extra(id_practica).subscribe({
        next: (data: any) => {
          respuesta = { ...respuesta, ...data }
        },
        error: (error: any) => {
          this.documentos = [];
          this._snackBar.open("Error al solicitar los documentos_extra de la práctica", "Cerrar", {
            duration: 10000,
            panelClass: ['red-snackbar']
          });
        },
        complete: () => {
          console.log("documentos_extra: ", respuesta.body);
          this.documentos_extra = respuesta.body;
          this.rerender();
        }
      }); // fin request para obtener los documentos_extra de la práctica
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
