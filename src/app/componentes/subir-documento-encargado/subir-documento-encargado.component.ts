import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { Router} from '@angular/router';
import { DocumentacionService } from 'src/app/servicios/documento_encargado/documentacion.service';

import {v4 as uuidv4} from 'uuid';
import { Observable, Subscriber } from 'rxjs';

export interface DialogData {

}

@Component({
  selector: 'app-subir-documento-encargado',
  templateUrl: './subir-documento-encargado.component.html',
  styleUrls: ['./subir-documento-encargado.component.scss']
})

export class SubirDocumentoEncargadoComponent {

  @Input() id_encargado:number = -1;
  @Input() id_carrera:number = -1;

  observando!:Observable<any>
  codigobase64!:any;

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar, private archivo_service: ArchivosService, private router: Router, 
      private docu_service: DocumentacionService) {}
  /*
  getBase64(file: File) {
    const observable = new Observable((subscriber:Subscriber<any>) => {
      this.readfile(file,subscriber)
    })
    observable.subscribe((d) => {
      this.observando = d;
      this.codigobase64 = d;
      console.log(this.codigobase64);

      
    })
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('file object is null');
      }
  
      var reader = new FileReader();
  
      reader.onloadend = function () {
        resolve({ res: reader.result, name: file.name });
        };
      reader.readAsDataURL(file);
    });
  }
  */

  readfile(file:File, subscriber:Subscriber<any>){
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
      
    let formatos = ["pdf", "doc", "docx", "xls", "xlsx"]
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

      this.archivo_service.checkFileType(file, formatos).then((type_file: boolean) => {
        if (!type_file) {
          this._snackBar.open("Archivo con formato incorrecto", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 3000
          });
          return;
        }

        let _data: any = {};

      let _filename = file.name.toLowerCase();
      let file_ext = _filename.slice((_filename.lastIndexOf(".") - 1 >>> 0) + 2)

      let key: string = uuidv4() +"." + file_ext;

      this.docu_service.nuevo_documento(file, this.id_encargado,this.id_carrera, file_ext, file.name, key).subscribe({
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

@Component({
  selector: 'app-dialog3',
  templateUrl: 'dialog3.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, CommonModule,
    NgFor],
})
export class Dialog3 {
  selectedFile: File | null = null;

  constructor(public dialogRef: MatDialogRef<Dialog3>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
