import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-configuracion-practica',
  templateUrl: './configuracion-practica.component.html',
  styleUrls: ['./configuracion-practica.component.scss']
})


export class ConfiguracionPracticaComponent implements OnInit {

    dataSourcePacksOpcionesPregunta!: MatTableDataSource<any>;
    fg!: FormGroup;

    displayedColumnsOpcionesPregunta = ["opcion_pregunta", "eliminar"]
    opcion_pregunta = new FormControl('')

    dataSourcePacksHoras!: MatTableDataSource<any>;
    dataSourcePacksMeses!: MatTableDataSource<any>;
    displayedColumnsHoras = ["opcion_horas", "eliminar"]
    displayedColumnsMeses = ["opcion_meses", "eliminar"]
    opcion_horas = new FormControl('')
    opcion_meses = new FormControl('')

    nombrePractica: string;
    cant_horas: number[] = [];
    cant_meses: number[] = [];
    horas: boolean;
    meses: boolean;
    frecuenciaInformes: string;
    informeFinal: string;
    preguntaFORM = new FormControl('')
  
    constructor(private _fb: FormBuilder,
      private cd: ChangeDetectorRef) {
  
    }

    formdata: any;
    pregunta: string;
    tipo_pregunta: string;

    //decide que se muestra en el html
    estado: string = "configuracion_general";
    habilitarHoras: boolean = false;    
    habilitarMeses: boolean = false;

    lista_preguntas_avance: string[] = [];
    tipos_preguntas_avance: string[] = [];
    lista_opciones_preguntas_avance: string[] = [];

    lista_preguntas_final: string[] = [];
    tipos_preguntas_final: string[] = [];
    lista_opciones_preguntas_final: string[] = [];

    lista_nombre_solicitud_documentos: string[] = [];
    lista_description_solicitud_documentos: string[] = [];
    lista_tipo_solicitud_documentos: string[] = [];
  
    ngOnInit(): void {
    //! Agregar aca todos los FormControl
      this.fg = this._fb.group({
        opcion_preguntaFORM: this.opcion_pregunta, //para poder definir tipo de pregunta
        opcion_horasFORM: this.opcion_horas,
        opcion_mesesFORM: this.opcion_meses,


        nombrePractica: new FormControl("Practica 1"),
        cant_horas: this.cant_horas,
        cant_meses: this.cant_meses,
        horas: new FormControl(),
        meses: new FormControl(),
        frecuenciaInformes: new FormControl(),
        informeFinal: new FormControl(),
        //pregunta: this.preguntaFORM,

        preguntaFORM: this.pregunta,
        
        arregloOpcionesPreguntas: this._fb.array([]),
        arregloHoras: this._fb.array([]),
        arregloMeses: this._fb.array([])

      });
  
    };

    habilitarHorasFunc(arg: any) {
        this.habilitarHoras = arg.target.checked;
    }

    habilitarMesesFunc(arg: any) {
        this.habilitarMeses = arg.target.checked;
    }

    get arregloOpcionesPreguntas() {
        return this.fg.controls["arregloOpcionesPreguntas"] as FormArray;
    };
    get arregloHoras() {
        return this.fg.controls["arregloHoras"] as FormArray;
    };
    get arregloMeses() {
        return this.fg.controls["arregloMeses"] as FormArray;
    };
  
    addOpcionPregunta(): void {
      const opcionesPreguntaForm = this._fb.group({
        opcion_pregunta: [''],
      });
   
      this.arregloOpcionesPreguntas.push(opcionesPreguntaForm);
      this.dataSourcePacksOpcionesPregunta = new MatTableDataSource(this.arregloOpcionesPreguntas.controls);
  
      this.cd.detectChanges();
  
    };
    addHoras(): void {
        const horasForm = this._fb.group({
            opcion_horas: [''],
        });

        this.arregloHoras.push(horasForm);
        this.dataSourcePacksHoras = new MatTableDataSource(this.arregloHoras.controls);
        this.cd.detectChanges();
    }
    addMeses(): void {
        const mesesForm = this._fb.group({
            opcion_meses: [''],
        });

        this.arregloMeses.push(mesesForm);
        this.dataSourcePacksMeses = new MatTableDataSource(this.arregloMeses.controls);
        this.cd.detectChanges();
    }
  
    deleteOpcionPregunta(opcionPreguntaIndex: number): void {
  
      this.arregloOpcionesPreguntas.removeAt(opcionPreguntaIndex);
      this.dataSourcePacksOpcionesPregunta = new MatTableDataSource(this.arregloOpcionesPreguntas.controls);
  
    };
    deleteHoras(horasIndex: number): void {
  
        this.arregloHoras.removeAt(horasIndex);
        this.dataSourcePacksHoras = new MatTableDataSource(this.arregloHoras.controls);
    
    };
    deleteMeses(mesesIndex: number): void {
  
        this.arregloMeses.removeAt(mesesIndex);
        this.dataSourcePacksMeses = new MatTableDataSource(this.arregloMeses.controls);
    
    };

  
    onSubmitPractica() {
      this.nombrePractica = this.fg.value.nombrePractica;
      this.horas = this.fg.value.horas;
      this.meses = this.fg.value.meses;
      this.frecuenciaInformes = this.fg.value.frecuenciaInformes;
      this.informeFinal = this.fg.value.informeFinal;
      this.opcion_horas = this.arregloHoras.value;
      this.opcion_meses = this.arregloMeses.value;

      for (let i = 0; i < Object.keys(this.opcion_horas).length; i++) {
        this.cant_horas.push(Number(Object.values(Object.values(this.opcion_horas)[i])[0]))
      }
      for (let i = 0; i < Object.keys(this.opcion_meses).length; i++) {
        this.cant_horas.push(Number(Object.values(Object.values(this.opcion_meses)[i])[0]))
      }

      //cambio estado vista
      if (this.frecuenciaInformes == "sinAvance" && this.informeFinal == "no") {
        this.estado = "solicitud_documentos";
        console.log("documentos");
      }
      else if (this.frecuenciaInformes =="sinAvance" && this.informeFinal == "si") {
        this.estado = "informe_final";
        console.log("informe final");
      }
      else if (this.frecuenciaInformes !="sinAvance") {
        this.estado = "informe_avance";
        console.log("informe avance");
      }
      console.log("estado:", this.estado);
      console.log("fg values:", this.fg.value);
    }

    onSubmitAddPreguntaAvance() {
      //this.lista_opciones_preguntas = [];
      this.pregunta = this.fg.value.preguntaFORM;

      this.opcion_pregunta = this.arregloOpcionesPreguntas.value;
      //console.log(typeof this.opcion_pregunta);

      var string_pregunta = String(this.pregunta)

      //console.log(string_pregunta);
      this.lista_preguntas_avance.push(string_pregunta);
      console.log(this.lista_preguntas_avance);

      this.tipos_preguntas_avance.push(this.tipo_pregunta);
      console.log(this.tipos_preguntas_avance);


      var opciones_de_una_pregunta = ""
      if (Object.keys(this.opcion_pregunta).length == 0) {
        console.log("no hay opciones");
      }
      else {
        console.log("hay opciones");
        //var string_pregunta = String(this.pregunta)
        for (let i = 0; i < Object.keys(this.opcion_pregunta).length; i++) {
          opciones_de_una_pregunta = opciones_de_una_pregunta + String(Object.values(Object.values(this.opcion_pregunta)[i])[0])
          opciones_de_una_pregunta = opciones_de_una_pregunta + ","
          //string_pregunta = string_pregunta + ","
          //string_pregunta = string_pregunta + String(Object.values(Object.values(this.opcion_pregunta)[i])[0])
          //console.log(Object.values(Object.values(this.opcion_pregunta)[i])[0]);
          
        }
        opciones_de_una_pregunta = opciones_de_una_pregunta.slice(0, -1);
        //console.log(string_pregunta);
        //this.lista_preguntas_avance.push(string_pregunta);
        //console.log(this.lista_preguntas_avance);
      }
      this.lista_opciones_preguntas_avance.push(opciones_de_una_pregunta);
      console.log(this.lista_opciones_preguntas_avance);

      //limpieza opciones anteriores
      this.arregloOpcionesPreguntas.clear();
    }

    onSubmitAddPreguntaFinal() {

      //this.lista_opciones_preguntas = [];
      this.pregunta = this.fg.value.preguntaFORM;

      this.opcion_pregunta = this.arregloOpcionesPreguntas.value;
      //console.log(typeof this.opcion_pregunta);

      var string_pregunta = String(this.pregunta)

      //console.log(string_pregunta);
      this.lista_preguntas_final.push(string_pregunta);
      console.log(this.lista_preguntas_final);

      this.tipos_preguntas_final.push(this.tipo_pregunta);
      console.log(this.tipos_preguntas_final);


      var opciones_de_una_pregunta = ""
      if (Object.keys(this.opcion_pregunta).length == 0) {
        console.log("no hay opciones");
      }
      else{
        console.log("hay opciones");
        //var string_pregunta = String(this.pregunta)
        for (let i = 0; i < Object.keys(this.opcion_pregunta).length; i++) {
          string_pregunta = string_pregunta + ","
          opciones_de_una_pregunta = opciones_de_una_pregunta + String(Object.values(Object.values(this.opcion_pregunta)[i])[0])
          opciones_de_una_pregunta = opciones_de_una_pregunta + ","
          //console.log(Object.values(Object.values(this.opcion_pregunta)[i])[0]);
        }
        opciones_de_una_pregunta = opciones_de_una_pregunta.slice(0, -1);
        //console.log(string_pregunta);
        //this.lista_preguntas_avance.push(string_pregunta);
        //console.log(this.lista_preguntas_avance);
      }

      this.lista_opciones_preguntas_final.push(opciones_de_una_pregunta);
      console.log(this.lista_opciones_preguntas_final);

      //limpieza opciones anteriores
      this.arregloOpcionesPreguntas.clear();
    }

    tipoPregunta(arg: any) {

      if (arg.target.value == "0") {
        this.tipo_pregunta = "sin_tipo";
        //vacia el array de opciones guardadas anteriormente
        this.arregloOpcionesPreguntas.clear();
        console.log(this.tipo_pregunta);
      }
  
      if (arg.target.value == "1") {
        this.tipo_pregunta = "abierta";
        //vacia el array de opciones guardadas anteriormente
        this.arregloOpcionesPreguntas.clear();
        console.log(this.tipo_pregunta);
      }
      else if (arg.target.value == "2") {
        this.tipo_pregunta = "casillas";
        console.log(this.tipo_pregunta);
      } 
      else if (arg.target.value == "3") {
        this.tipo_pregunta = "alternativas";
        console.log(this.tipo_pregunta);
      }
    }

    numSequence(n: number): Array<number> {
      return Array(n);
    }

    lengthArray(array: Array <string> ): number{
      return array.length;
    }

    avanzarDesdePreguntasAvance(){
      if (this.informeFinal == "si") {
        this.estado = "informe_final";
      }
      else {
        this.estado = "solicitud_documentos";
      }
      this.arregloOpcionesPreguntas.clear();
    }

    avanzarDesdePreguntasFinal(){
      this.estado = "solicitud_documentos";
    }

    onSubmitAddSolicitudDoc(){
      console.log("documento agregado");
    }
  }
