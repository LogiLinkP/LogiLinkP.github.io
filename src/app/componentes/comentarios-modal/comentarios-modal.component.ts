import { Component, Input, OnInit } from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comentarios-modal',
  templateUrl: './comentarios-modal.component.html',
  styleUrls: ['./comentarios-modal.component.scss']
})
export class ComentariosModalComponent implements OnInit{
  @Input() id_p: any;
  @Input() data_response: any;
  @Input() flag: any;

  preguntas_respuestas: any = [];

  constructor(private servicio_datos: ObtenerDatosService, private _snackBar: MatSnackBar) { }

   ngOnInit(): void {
    
   }
}
