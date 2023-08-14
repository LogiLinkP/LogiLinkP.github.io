import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-configuracion-practica',
  templateUrl: './configuracion-practica.component.html',
  styleUrls: ['./configuracion-practica.component.scss']
})
export class ConfiguracionPracticaComponent implements OnInit {
  formdata: any;
  nombrePractica: string;
  horas: boolean;
  meses: boolean;
  cant_horas: number[];
  cant_meses: number[]; 

  constructor(@Inject(DOCUMENT) private document: Document) {}
  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }

  ngOnInit() {
    this.formdata = new FormGroup({
      nombrePractica: new FormControl("Practica 1"),
      horas: new FormControl(false),
      meses: new FormControl(false)
    });
  }
  onClickSubmit(data: any) {
    this.nombrePractica = data.nombrePractica;
    this.horas = data.horas;
    this.meses = data.meses;
    this.cant_horas = data.cant_horas;
    this.cant_meses = data.cant_meses;
  }
}
