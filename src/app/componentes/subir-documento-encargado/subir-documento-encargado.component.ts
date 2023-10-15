import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common'
import { DocumentosService } from '../../servicios/encargado/documentos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArchivosService } from '../../servicios/archivos/archivos.service';
import { ActivatedRoute, Router} from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { Dialog2 } from '../subir-archivo/subir-archivo.component';

export interface DialogData {
  nombre_solicitud: string;
  nombre_documento: string;
  tipo_archivo: string[];
}

@Component({
  selector: 'app-subir-documento-encargado',
  templateUrl: './subir-documento-encargado.component.html',
  styleUrls: ['./subir-documento-encargado.component.scss']
})

export class SubirDocumentoEncargadoComponent {
  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar, private archivo_service: ArchivosService, private router: Router, 
    private activated_route: ActivatedRoute, private service_noti: NotificacionesService) {}

  subir_archivos() {

    const dialogRef = this.dialog.open(Dialog2, {
      width: '400px',
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result || !result[0]) {
        return;
      }
      let [, file] = result;
      this.archivo_service.checkFileType(file, tipo_archivo).then((type_file: boolean) => {
        if (!type_file) {
          this._snackBar.open("Archivo con formato incorrecto", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 3000
          });
          return;
        }

        let _data: any = {};
        
        this.archivo_service.subirDocumento(file, id_solicitud, id_practica).subscribe({
          next: data => {
            _data = { ..._data, ...data }
          },
          complete: () => {
            let upload_string = "";
            if (_data.status == 200) {
              upload_string = "?upload_success=success";
              let respuesta: any = [];
              let enlace = environment.url_front + "/practicas/" + this.id_estudiante_usuario;

              this.service_noti.postnotificacion(this.id_encargado_usuario, "El alumno ha subido el archivo extra solicitado", this.correo_encargado, this.estado_config, enlace).subscribe({
                next: (data: any) => {
                  respuesta = { ...respuesta, ...data };
                },
                error: (error: any) => {
                  console.log(error);
                  return;
                },
                complete: () => {
                  console.log("Notificacion enviada con exito");
                }
              });
            } else if (_data.status == 415) {
              upload_string = "?upload_success=format";
            } else {
              upload_string = "?upload_success=error";
            }
            // check if the current url already has a query string and remove it
            let newUrl = this.router.url.split("?")[0];
            newUrl += upload_string;
            window.location.href = newUrl;
          },
          error: error => {
            if (error.status == 415) {
              this._snackBar.open("Archivo con formato incorrecto", "Cerrar", {
                panelClass: ['red-snackbar'],
                duration: 3000
              });
            } else {
              this._snackBar.open("Error al subir archivo", "Cerrar", {
                panelClass: ['red-snackbar'],
                duration: 3000
              });
            }
          }
        });
      });
    });
  }
}
