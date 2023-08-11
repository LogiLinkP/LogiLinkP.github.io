import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common'
import { DocumentosService } from '../../servicios/encargado/documentos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  formatos: Formato[];
}
interface Formato {
  formato: string, extensiones: string[];
}

@Component({
  selector: 'app-boton-solicitar-archivo',
  templateUrl: './boton-solicitar-archivo.component.html',
  styleUrls: ['./boton-solicitar-archivo.component.scss']
})
export class BotonSolicitarArchivoComponent {
  formatos: Formato[] = [
    { formato: 'PDF', extensiones: ['pdf'] },
    { formato: "Imagen", extensiones: ["jpg", "jpeg", "png"] },
    { formato: 'Word', extensiones: ['docx', "doc"] },
    { formato: 'Excel', extensiones: ['xlsx', "xls"] },
  ];

  constructor(public dialog: MatDialog, private doc_service: DocumentosService, private _snackBar: MatSnackBar) { }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(Dialog, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { formatos: this.formatos }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result[0]) {
        let [, nombre, descripcion, formato] = result;
        let datos = {
          id_practica: 1,
          nombre_solicitud: nombre,
          descripcion: descripcion || "",
          tipo_archivo: formato.join(","),
          key: null
        }
        this.doc_service.solicitar_documento_extra(datos).subscribe({
          next: (data: any) => {
          },
          complete: () => {
            this._snackBar.open("Documento Solicitado", "Cerrar", {
              panelClass: ['green-snackbar'],
              duration: 3000
            });
          },
          error: (error: any) => {
            this._snackBar.open("Error al solicitar documento", "Cerrar", {
              panelClass: ['red-snackbar'],
              duration: 3000
            });
          }
        });
      } else
        console.log("No se ha seleccionado ningún archivo")
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
  nombre: string;
  descripcion: string;
  formato: string[];

  constructor(public dialogRef: MatDialogRef<Dialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}