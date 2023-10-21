import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, Validators, FormsModule, FormBuilder, ReactiveFormsModule  } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArchivosService } from '../../servicios/archivos/archivos.service';
import { Router} from '@angular/router';
import { DocumentacionService } from 'src/app/servicios/documento_encargado/documentacion.service';
import { EmitType } from '@syncfusion/ej2-base';

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
      private docu_service: DocumentacionService, private fb: FormBuilder) {
      }


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
      console.log(result)
      console.log(result[0])
      if (!result || !result[0]) {
        console.log("CANCELADO")
        return;
      }
      if(!result[1] || !result[2]){
        this._snackBar.open("Recuerda Ingresar Título y Descripción", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 3000
        });
        return
      }
      let [, file, nombre, descripcion] = result;
      if(file.size>10000000){
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

        let _data: any = {};

      let _filename = file.name.toLowerCase();
      let file_ext = _filename.slice((_filename.lastIndexOf(".") - 1 >>> 0) + 2)

      let key: string = uuidv4() +"." + file_ext;

      this.docu_service.nuevo_documento(file, this.id_encargado,this.id_carrera, file_ext, nombre, key, descripcion).subscribe({
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
    NgFor, ReactiveFormsModule],
})
export class Dialog3 {
  selectedFile: File | null = null;
  Nombre:String = ""
  Descripcion:String = ""
  publiForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<Dialog3>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) {
    this.createForm();
   }


  createForm() {
    this.publiForm = this.fb.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', [Validators.required]],
      });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    console.log(this.selectedFile)
  }

  onNoClick(): void {
    console.log("CANCELAR")
    this.dialogRef.close();
  }

  submitclick(){
    let data = this.publiForm.value
    this.Nombre = data.Nombre
    this.Descripcion = data.Descripcion
    this.dialogRef.close([true, this.selectedFile, this.Nombre, this.Descripcion]);
  }
}
