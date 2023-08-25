import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'

import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';

import { PreguntasEncuestaFinalService } from 'src/app/servicios/alumno/preguntas-encuesta-final.service';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent {
  constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef, @Inject(DOCUMENT) private document: Document, private router: Router,
  private serviceBarra: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute,
  private serviceComplete: ConfigService, private servicePreguntas: PreguntasEncuestaFinalService, private _snackbar: MatSnackBar) {}









  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }
}
