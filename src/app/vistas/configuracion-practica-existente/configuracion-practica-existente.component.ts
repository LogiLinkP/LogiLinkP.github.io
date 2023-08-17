import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-configuracion-practica-existente',
  templateUrl: './configuracion-practica-existente.component.html',
  styleUrls: ['./configuracion-practica-existente.component.scss']
})
export class ConfiguracionPracticaExistenteComponent implements OnInit {
  rutas = environment;
  config: any;
  flag: boolean = false;
  nombre_config: string | null;

  formdata: FormGroup;
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

  constructor(private service: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document) {}

  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }

  ngOnInit(): void {
    let respuesta: any = {};

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.nombre_config = params.get('nombre');
    })

    this.service.obtenerConfigPracticaNombre(this.nombre_config).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        this._snackBar.open("Error al buscar configuracion de practica", "Cerrar", {
          duration: 3000,
          panelClass: ['red-snackbar']
        });
        console.log("Error al buscar configuracion de practica", error);
      },
      complete: () => {
        this.config = respuesta.body;
        console.log(this.config);
        this.generarFormulario();
        this.flag = true;
      }
    });
  }

  generarFormulario() {
    for (let i = 0; i < this.config.length; i++) {
      if (this.config[i].modalidad == "horas") {
        this.horas = true;
      }
      if (this.config[i].modalidad == "meses") {
        this.meses = true;
      }
      //if (this.config[i].modalidad == "convalidar") {
      //  this.meses = true;
      //}
    }

    this.formdata = new FormGroup({
      nombrePractica: new FormControl(this.config[0].nombre),
      horas: new FormControl(this.horas),
      meses: new FormControl(this.meses),
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