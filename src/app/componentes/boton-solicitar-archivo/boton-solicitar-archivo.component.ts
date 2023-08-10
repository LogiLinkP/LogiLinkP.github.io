import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';

export interface DialogData {
  nombre: string;
  formato: string;
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
  formato: string;
  nombre: string;
  formatos: Formato[] = [
    { formato: 'pdf', extensiones: ['pdf'] },
    { formato: "imagen", extensiones: ["jpg", "jpeg", "png"] },
    { formato: 'word', extensiones: ['docx', "doc"] },
    { formato: 'excel', extensiones: ['xlsx', "xls"] },
  ]

  constructor(public dialog: MatDialog) { }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(Dialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { nombre: this.nombre, formato: this.formato, formatos: this.formatos }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.formato = result;
    });
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule],
})
export class Dialog {
  constructor(public dialogRef: MatDialogRef<Dialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}