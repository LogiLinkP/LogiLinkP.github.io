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

export interface DialogData {
  nombre_solicitud: string;
  descripcion: string;
  tipo_archivo: string[];
}

@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  styleUrls: ['./subir-archivo.component.scss']
})
export class SubirArchivoComponent {
  @Input() id_solicitud: number = 0;
  @Input() id_practica: number = 0;
  @Input() nombre_solicitud: string = "";
  @Input() descripcion: string = "";
  @Input() tipo_archivo: string[] = [];

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar, private archivo_service: ArchivosService) { }

  subir_archivos() {
    let id_solicitud = this.id_solicitud;
    let id_practica = this.id_practica;
    let nombre_solicitud = this.nombre_solicitud;
    let descripcion = this.descripcion;
    let tipo_archivo = this.tipo_archivo;

    const dialogRef = this.dialog.open(Dialog, {
      width: '400px',
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
        this.archivo_service.subirDocumento(file, id_solicitud, id_practica).subscribe({
          next: data => {
            _data = { ..._data, ...data }
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