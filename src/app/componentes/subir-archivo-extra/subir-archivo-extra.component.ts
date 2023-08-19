import { Component, Inject, Input } from '@angular/core';
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


export interface DialogData {
  nombre_solicitud: string;
  descripcion: string;
  tipo_archivo: string[];
}

@Component({
  selector: 'app-subir-archivo-extra',
  templateUrl: './subir-archivo-extra.component.html',
  styleUrls: ['./subir-archivo-extra.component.scss']
})
export class SubirArchivoExtraComponent {
  @Input() id_documento_extra: number = -1;
  @Input() nombre_solicitud: string = "";
  @Input() descripcion: string = "";
  @Input() tipo_archivo: string[] = [];

  constructor(public dialog: MatDialog, private doc_service: DocumentosService, private router: Router, 
              private activated_route: ActivatedRoute, private _snackBar: MatSnackBar, 
              private archivo_service: ArchivosService) { }

  subir_archivos() {
    let id_documento_extra = this.id_documento_extra;
    let nombre_solicitud = this.nombre_solicitud;
    let descripcion = this.descripcion;
    let tipo_archivo = this.tipo_archivo;

    const dialogRef = this.dialog.open(Dialog, {
      width: '300px',
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
      data: { nombre_solicitud, descripcion, tipo_archivo }
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
        this.archivo_service.subirDocExtra(file, id_documento_extra).subscribe({
          next: data => {
            _data = { ..._data, ...data }
          },
          complete: () => {
            let upload_string = "";
            if (_data.status == 200) {
              upload_string = "?upload_success=success";
            } else if (_data.status == 415) {
              upload_string = "?upload_success=format";
            } else {
              upload_string = "?upload_success=error";
            }         
            const newUrl = this.router.url + upload_string;
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

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, CommonModule,
    NgFor],
})
export class Dialog {
  selectedFile: File | null = null;

  constructor(public dialogRef: MatDialogRef<Dialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
