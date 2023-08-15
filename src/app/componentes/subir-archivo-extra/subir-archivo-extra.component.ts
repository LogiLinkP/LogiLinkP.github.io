import { Component, Inject } from '@angular/core';
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
  constructor(public dialog: MatDialog, private doc_service: DocumentosService,
    private _snackBar: MatSnackBar, private archivo_service: ArchivosService) { }

  subir_archivos(id_documento_extra: number, nombre_solicitud: string, descripcion: string, tipo_archivo: string[]) {
    const dialogRef = this.dialog.open(Dialog, {
      width: '300px',
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
      data: { nombre_solicitud, descripcion, tipo_archivo }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result || !result[0]) {
        console.log("No se ha seleccionado ningún archivo");
        return;
      }
      let [, file] = result;
      this.archivo_service.checkFileType(file, tipo_archivo).then((type_file: boolean) => {
        console.log("filetype!!!!", type_file);
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
            _data = { ..._data, data }
          },
          complete: () => {
            if (_data.status == 200) {
              this._snackBar.open("Archivo subido correctamente", "Cerrar", {
                panelClass: ['green-snackbar'],
                duration: 3000
              });
            } else if (_data.status == 415) {
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
          },
          error: error => {
            console.log(error);
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
