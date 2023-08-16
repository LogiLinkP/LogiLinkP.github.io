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
  tipo_pregrunta: string;
  cantidad_opciones: number;
  opciones_pregunta: string[] = [];

  preguntas: string[] = [];


  constructor(@Inject(DOCUMENT) private document: Document) {}
  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }

  ngOnInit() {
    this.formdata = new FormGroup({
      nombrePractica: new FormControl("Practica 1"),
      horas: new FormControl(false),
      meses: new FormControl(false),
      cant_horas: new FormControl(),
      cant_meses: new FormControl(),
      frecuenciaInformes: new FormControl(),
      informeFinal: new FormControl(),
      tipoPregunta: new FormControl(),
      pregunta: new FormControl(),
      cantidad_opciones: new FormControl(),
      opciones_pregunta: new FormControl()
    });
  }

  AddPractica(data: any) {
    this.nombrePractica = data.nombrePractica;
    this.horas = data.horas;
    this.meses = data.meses;

    this.cant_horas = data.cant_horas;
    this.cant_meses = data.cant_meses;

    this.frecuencia_informe = data.frecuenciaInformes;
    this.informe_final = data.informeFinal;

    console.log(data);
  }

  tipoPregunta(arg: any) {

    if (arg.target.value == "0") {
      this.tipo_pregrunta = "sin_tipo";
      console.log(this.tipo_pregrunta);
    }

    if (arg.target.value == "1") {
      this.tipo_pregrunta = "abierta";
      console.log(this.tipo_pregrunta);
    }
    else if (arg.target.value == "2") {
      this.tipo_pregrunta = "casillas";
      console.log(this.tipo_pregrunta);
    } 
    else if (arg.target.value == "3") {
      this.tipo_pregrunta = "alternativas";
      console.log(this.tipo_pregrunta);
    }
  }

  cantidadOpciones(arg: any) {
    this.cantidad_opciones = parseInt(arg.target.value);
    console.log(arg.target.value);
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  AddPregunta(data: any) {
    //this.preguntas = data.preguntas;
    this.preguntas.push(data.pregunta);
    console.log(this.preguntas);
    }
}
