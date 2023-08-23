//import { Component } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'

import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';

import { PreguntasEncuestaFinalService } from 'src/app/servicios/alumno/preguntas-encuesta-final.service';

@Component({
  selector: 'app-encuesta-fin-practica',
  templateUrl: './encuesta-fin-practica.component.html',
  styleUrls: ['./encuesta-fin-practica.component.scss']
})
export class EncuestaFinPracticaComponent {

  constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef, @Inject(DOCUMENT) private document: Document,
                private serviceBarra: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute,
                private serviceComplete: ConfigService, private servicePreguntas: PreguntasEncuestaFinalService) {}

  id_practica = 1; // hardcodeado

  preguntas_encuesta: object[] = [];

  enunciados_preguntas: string[] = [];
  tipos_preguntas: string[] = [];
  opciones_preguntas: string[][] = [];

  array_values: any[] = [];

  ngOnInit(): void {

    let respuesta: any = {};

    this.servicePreguntas.obtener_preguntas(this.id_practica).subscribe({
      next: data => {
        //console.log(data);
        respuesta = { ...respuesta, ...data }
        //console.log(data);
        //console.log(respuesta);
        console.log(respuesta.body);
        console.log(respuesta.body.length);

        for (let i = 0; i < respuesta.body.length; i++) {
          console.log(respuesta.body[i]);
          this.preguntas_encuesta.push(respuesta.body[i]);
        }

        console.log(this.preguntas_encuesta);
        console.log(Object.values(this.preguntas_encuesta[0]));

        
      },
      error: error => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      }
    });

  }


  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
}

}
