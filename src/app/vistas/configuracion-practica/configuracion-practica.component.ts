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
  cant_horas: string;
  cant_meses: string;
  frecuencia_informe: any;
  informe_final: any;


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

    

    this.frecuencia_informe = data.frecuenciaInformes;
    this.informe_final = data.informeFinal;

    console.log(this.nombrePractica);
    console.log(this.horas);
    console.log(this.meses);
    console.log(this.cant_horas);
    console.log(this.cant_meses);
    console.log(this.frecuencia_informe);
    console.log(this.informe_final);
  }
}
