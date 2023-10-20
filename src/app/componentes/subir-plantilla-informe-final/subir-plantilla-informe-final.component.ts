import { Component, Inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArchivosService } from '../../servicios/archivos/archivos.service';
import { Router } from '@angular/router';
import { EmitType } from '@syncfusion/ej2-base';

import { v4 as uuidv4 } from 'uuid';
import { Observable, Subscriber } from 'rxjs';

export interface DialogData {

}

@Component({
  selector: 'app-subir-plantilla-informe-final',
  templateUrl: './subir-plantilla-informe-final.component.html',
  styleUrls: ['./subir-plantilla-informe-final.component.scss']
})
export class SubirPlantillaInformeFinalComponent {

  @Output() key_event = new EventEmitter<string>();
  @Output() file_plantilla_event = new EventEmitter<File>();

  nombre_archivo: string = "";

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar, private archivo_service: ArchivosService, private router: Router,) { }

  readfile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader()

    filereader.readAsDataURL(file)

    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete;
    }
    filereader.onerror = () => {
      subscriber.error()
      subscriber.complete();
    }
  }

  subir_archivos() {
    let formatos = ["pdf", "doc", "docx"]
    const dialogRef = this.dialog.open(Dialog3, {
      width: '400px',
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result || !result[0]) {
        return;
      }
      let [, file] = result;
      if (file.size > 10000000) {
        this._snackBar.open("Este Archivo es Demasiado Grande", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 3000
        });
        return
      }

      this.archivo_service.checkFileType(file, formatos).then((type_file: boolean) => {
        if (!type_file) {
          this._snackBar.open("Archivo con formato incorrecto", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 3000
          });
          return;
        }


        let _filename = file.name.toLowerCase();
        this.nombre_archivo = _filename;
        let file_ext = _filename.slice((_filename.lastIndexOf(".") - 1 >>> 0) + 2)

        // wait for 1 second and then emit event
        
        this.key_event.emit(uuidv4() + "." + file_ext);
        this.file_plantilla_event.emit(file);
      });
    });
  }
}

@Component({
  selector: 'app-dialogPlantilla',
  templateUrl: 'dialogPlantilla.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, CommonModule,
    NgFor],
})
export class Dialog3 {
  selectedFile: File | null = null;

  constructor(public dialogRef: MatDialogRef<Dialog3>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    console.log(this.selectedFile)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
