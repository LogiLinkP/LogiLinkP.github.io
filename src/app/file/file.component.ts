import { Component } from '@angular/core';
import { ArchivosService } from "src/app/Servicios/archivos.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent {
  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  progress: number = 0;
  selectedFiles?: FileList;
  currentFile?: File;
  message: string = '';

  constructor(private service: ArchivosService, private _snackBar: MatSnackBar) {
    console.log("stoy")
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;
    console.log(this.selectedFiles)
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        console.log(file);

        this.service.uploadFile(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              //this.fileInfos = this.uploadService.getFiles();
              this._snackBar.open("Archivo subido", "Cerrar", {
                panelClass: ['green-snackbar']
              });
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this._snackBar.open("Error al subir archivo", "Cerrar", {
              panelClass: ['red-snackbar']
            });

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }

  onFileChange(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

}
