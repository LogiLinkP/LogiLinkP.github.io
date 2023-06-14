import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {ArchivosService} from "src/app/Servicios/archivos.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs';

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

  selectedFiles?: FileList;

  constructor(private service: ArchivosService, private _snackBar: MatSnackBar) {

  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

}
