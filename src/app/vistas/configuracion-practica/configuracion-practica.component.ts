import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'

import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';

import { map, tap } from 'rxjs/operators';
import e from 'express';

@Component({
  selector: 'app-configuracion-practica',
  templateUrl: './configuracion-practica.component.html',
  styleUrls: ['./configuracion-practica.component.scss']
})

export class ConfiguracionPracticaComponent implements OnInit {
    
    constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef, @Inject(DOCUMENT) private document: Document,
                private serviceBarra: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute,
                private serviceComplete: ConfigService) {}

    config: any;
    flag: boolean = false;
    nombre_config: string | null; //parece que alguna veces se vuelve null y queda la caga
    
    dataSourcePacks!: MatTableDataSource<any>;
    fg!: FormGroup;

    
    dataSourcePacksOpcionesPregunta!: MatTableDataSource<any>;
    dataSourcePacksHoras!: MatTableDataSource<any>;
    dataSourcePacksMeses!: MatTableDataSource<any>;

    displayedColumnsOpcionesPregunta = ["opcion_pregunta", "eliminar"]
    displayedColumnsHoras = ["opcion_horas", "eliminar"]
    displayedColumnsMeses = ["opcion_meses", "eliminar"]

    opcion_pregunta = new FormControl('')
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
    ramoFORM = new FormControl('')

    ramo: string;

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

    lista_preguntas_encuesta: string[] = [];
    tipos_preguntas_encuesta: string[] = [];
    lista_opciones_preguntas_encuesta: string[] = [];

    lista_preguntas_supervisor: string[] = [];
    tipos_preguntas_supervisor: string[] = [];
    lista_opciones_preguntas_supervisor: string[] = [];

    lista_ramos: string[] = [];

    nombre_solicitud_documentos: string;
    descripcion_solicitud_documentos: string;
    tipo_solicitud_documentos: string;
    //descripcion_solicitud_documentos = new FormControl('')
    //tipo_solicitud_documentos = new FormControl('')

    lista_nombre_solicitud_documentos: string[] = [];
    lista_descripcion_solicitud_documentos: string[] = [];
    lista_tipo_solicitud_documentos: string[] = [];

    scrollToTop(): void {
        this.document.body.scrollTop = 0;
        this.document.documentElement.scrollTop = 0;
    }
  
    ngOnInit(): void {
        let respuesta: any = {};

        this.route.paramMap.subscribe((params: ParamMap) => {
          this.nombre_config = params.get('nombre');
        })
    
        this.serviceBarra.obtenerConfigPracticaNombre(this.nombre_config).subscribe({
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
    };

    generarFormulario() {
        if (this.nombre_config == "blanco") {
            this.nombrePractica = "Practica 1";
            this.horas = false;
            this.meses = false;
            this.frecuenciaInformes = "";
            this.informeFinal = "";
        } else {
            // practica existente
            this.nombrePractica = this.config[0].nombre;
            // set modalidades
            for (let i = 0; i < this.config.length; i++) {
                if (this.config[i].modalidad == "horas") {
                    this.horas = true;
                }
                if (this.config[i].modalidad == "meses") {
                    this.meses = true;
                }
                //if (this.config[i].modalidad == "convalidable") {
                //  this.convalidable = true;
                //}
            }
            // set informes
            this.frecuenciaInformes = this.config[0].frecuencia_informes;
            this.informeFinal = this.config[0].informe_final;
        }

        this.fg = this._fb.group({
            opcion_preguntaFORM: this.opcion_pregunta, //para poder definir tipo de pregunta
            opcion_horasFORM: this.opcion_horas,
            opcion_mesesFORM: this.opcion_meses,
    
            nombrePractica: new FormControl(this.nombrePractica),
            cant_horas: this.cant_horas,
            cant_meses: this.cant_meses,
            horas: new FormControl(this.horas),
            meses: new FormControl(this.meses),
            frecuenciaInformes: new FormControl(this.frecuenciaInformes),
            informeFinal: new FormControl(this.informeFinal),
            //pregunta: this.preguntaFORM,

    
            preguntaFORM: this.pregunta,

            ramoFORM: this.ramo,
            
            arregloOpcionesPreguntas: this._fb.array([]),
            arregloHoras: this._fb.array([]),
            arregloMeses: this._fb.array([]),

            //documentos
            nombre_solicitud_documentos: new FormControl(this.nombre_solicitud_documentos),
            descripcion_solicitud_documentos: new FormControl(this.descripcion_solicitud_documentos),
            tipo_solicitud_documentos: new FormControl(this.tipo_solicitud_documentos),
            
    
        });
    }

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
        this.cant_meses.push(Number(Object.values(Object.values(this.opcion_meses)[i])[0]))
      }

      //cambio estado vista
      if (this.frecuenciaInformes == "sinAvance" && this.informeFinal == "no") {
        this.estado = "solicitud_documentos";
        //console.log("documentos");
      }
      else if (this.frecuenciaInformes =="sinAvance" && this.informeFinal == "si") {
        this.estado = "informe_final";
        //console.log("informe final");
      }
      else if (this.frecuenciaInformes !="sinAvance") {
        this.estado = "informe_avance";
        //console.log("informe avance");
      }
      //console.log("estado:", this.estado);
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
          opciones_de_una_pregunta = opciones_de_una_pregunta + ";;"
          //string_pregunta = string_pregunta + ","
          //string_pregunta = string_pregunta + String(Object.values(Object.values(this.opcion_pregunta)[i])[0])
          //console.log(Object.values(Object.values(this.opcion_pregunta)[i])[0]);
          
        }
        opciones_de_una_pregunta = opciones_de_una_pregunta.slice(0, -2);
        //console.log(string_pregunta);
        //this.lista_preguntas_avance.push(string_pregunta);
        //console.log(this.lista_preguntas_avance);
      }
      this.lista_opciones_preguntas_avance.push(opciones_de_una_pregunta);
      console.log("pregunas avance: ", this.lista_opciones_preguntas_avance);
      
      //limpieza opciones anteriores

      for (let i = 0; i < this.arregloOpcionesPreguntas.length; i++){
        this.deleteOpcionPregunta(i);
      }

      this.arregloOpcionesPreguntas.clear();
      this.pregunta = "";
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
          //string_pregunta = string_pregunta + ","
          opciones_de_una_pregunta = opciones_de_una_pregunta + String(Object.values(Object.values(this.opcion_pregunta)[i])[0])
          opciones_de_una_pregunta = opciones_de_una_pregunta + ";;"
          //console.log(Object.values(Object.values(this.opcion_pregunta)[i])[0]);
        }
        opciones_de_una_pregunta = opciones_de_una_pregunta.slice(0, -2);
        //console.log(string_pregunta);
        //this.lista_preguntas_avance.push(string_pregunta);
        //console.log(this.lista_preguntas_avance);
      }

      this.lista_opciones_preguntas_final.push(opciones_de_una_pregunta);
      console.log(this.lista_opciones_preguntas_final);

      //limpieza opciones anteriores

      for (let i = 0; i < this.arregloOpcionesPreguntas.length; i++){
        this.deleteOpcionPregunta(i);
      }

      this.arregloOpcionesPreguntas.clear();
      this.pregunta = "";
    }

    onSubmitAddPreguntaEncuesta() {
      //this.lista_opciones_preguntas = [];
      this.pregunta = this.fg.value.preguntaFORM;

      this.opcion_pregunta = this.arregloOpcionesPreguntas.value;
      //console.log(typeof this.opcion_pregunta);

      var string_pregunta = String(this.pregunta)

      //console.log(string_pregunta);
      this.lista_preguntas_encuesta.push(string_pregunta);
      console.log(this.lista_preguntas_encuesta);

      this.tipos_preguntas_encuesta.push(this.tipo_pregunta);
      console.log(this.tipos_preguntas_encuesta);


      var opciones_de_una_pregunta = ""
      if (Object.keys(this.opcion_pregunta).length == 0) {
        console.log("no hay opciones");
      }
      else{
        console.log("hay opciones");
        //var string_pregunta = String(this.pregunta)
        for (let i = 0; i < Object.keys(this.opcion_pregunta).length; i++) {
          //string_pregunta = string_pregunta + ","
          opciones_de_una_pregunta = opciones_de_una_pregunta + String(Object.values(Object.values(this.opcion_pregunta)[i])[0])
          opciones_de_una_pregunta = opciones_de_una_pregunta + ";;"
          //console.log(Object.values(Object.values(this.opcion_pregunta)[i])[0]);
        }
        opciones_de_una_pregunta = opciones_de_una_pregunta.slice(0, -2);
        //console.log(string_pregunta);
        //this.lista_preguntas_avance.push(string_pregunta);
        //console.log(this.lista_preguntas_avance);
      }

      this.lista_opciones_preguntas_encuesta.push(opciones_de_una_pregunta);
      console.log(this.lista_opciones_preguntas_encuesta);

      //limpieza opciones anteriores

      for (let i = 0; i < this.arregloOpcionesPreguntas.length; i++){
        this.deleteOpcionPregunta(i);
      }

      this.arregloOpcionesPreguntas.clear();
      this.pregunta = "";
    }

    onSubmitAddRamo(){
      this.ramo = this.fg.value.ramoFORM;
      this.lista_ramos.push(this.ramo);
      console.log(this.lista_ramos);

      this.ramo = "";
    }

    onSubmitAddPreguntaSupervisor() {
      //this.lista_opciones_preguntas = [];
      this.pregunta = this.fg.value.preguntaFORM;

      this.opcion_pregunta = this.arregloOpcionesPreguntas.value;
      //console.log(typeof this.opcion_pregunta);

      var string_pregunta = String(this.pregunta)

      //console.log(string_pregunta);
      this.lista_preguntas_supervisor.push(string_pregunta);
      console.log(this.lista_preguntas_supervisor);

      this.tipos_preguntas_supervisor.push(this.tipo_pregunta);
      console.log(this.tipos_preguntas_supervisor);


      var opciones_de_una_pregunta = ""
      if (Object.keys(this.opcion_pregunta).length == 0) {
        console.log("no hay opciones");
      }
      else{
        console.log("hay opciones");
        //var string_pregunta = String(this.pregunta)
        for (let i = 0; i < Object.keys(this.opcion_pregunta).length; i++) {
          //string_pregunta = string_pregunta + ","
          opciones_de_una_pregunta = opciones_de_una_pregunta + String(Object.values(Object.values(this.opcion_pregunta)[i])[0])
          opciones_de_una_pregunta = opciones_de_una_pregunta + ";;"
          //console.log(Object.values(Object.values(this.opcion_pregunta)[i])[0]);
        }
        opciones_de_una_pregunta = opciones_de_una_pregunta.slice(0, -2);
        //console.log(string_pregunta);
        //this.lista_preguntas_avance.push(string_pregunta);
        //console.log(this.lista_preguntas_avance);
      }

      this.lista_opciones_preguntas_supervisor.push(opciones_de_una_pregunta);
      console.log(this.lista_opciones_preguntas_supervisor);

      //limpieza opciones anteriores

      for (let i = 0; i < this.arregloOpcionesPreguntas.length; i++){
        this.deleteOpcionPregunta(i);
      }

      this.arregloOpcionesPreguntas.clear();
      this.pregunta = "";
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
      this.pregunta = "";
      this.printForm();
    }

    avanzarDesdePreguntasFinal(){
      this.estado = "solicitud_documentos";
      this.printForm();
    }

    avanzarDesdeSolicitudDocumentos(){
      this.estado = "encuesta_final";
      this.printForm();
    }

    avanzarDesdePreguntasEncuesta(){
      this.estado = "agregar_ramos";
      this.printForm();
    }

    avanzarDesdeRamos(){
      this.estado = "preguntas_supervisor";
      this.printForm();
    }

    avanzarDesdePreguntasSupervisor(){
      this.estado = "fin_configuracion";
      this.printForm();
    }

    volver(){

      console.log("volver");
      console.log(this.estado);
      //volver desde preguntas avance
      if (this.estado == "informe_avance") {
        this.estado = "configuracion_general";
      }

      //volver desde preguntas final
      if (this.estado == "informe_final") {
        if (this.frecuenciaInformes == "sinAvance"){
          this.estado = "configuracion_general";
        }
        else {
          this.estado = "informe_avance";
        }
      }
      //volver desde solicitud de documentos
      else if (this.estado == "solicitud_documentos") {
        if (this.informeFinal == "si") {
          this.estado = "informe_final";
        }
        else if (this.frecuenciaInformes == "sinAvance") {
          this.estado = "configuracion_general";
        }
        else {
          this.estado = "informe_avance";
        }
      }
      //volver desde encuesta final
      else if (this.estado == "encuesta_final") {
        this.estado = "solicitud_documentos";
      }
      //volver desde agregar ramos
      else if (this.estado == "agregar_ramos") {
        this.estado = "encuesta_final";
      }
      //volver desde preguntas supervisor
      else if (this.estado == "preguntas_supervisor") {
        this.estado = "agregar_ramos";
      }
      //volver desde fin configuracion
      else if (this.estado == "fin_configuracion") {
        this.estado = "preguntas_supervisor";
      }
      //this.printForm();
    }

    printForm() {
        console.log(this.fg.value);
    }

    onSubmitAddSolicitudDoc(){
      console.log("documento agregado");
      this.lista_nombre_solicitud_documentos.push(this.fg.value.nombre_solicitud_documentos);
      this.lista_descripcion_solicitud_documentos.push(this.fg.value.descripcion_solicitud_documentos);
      this.lista_tipo_solicitud_documentos.push(this.fg.value.tipo_solicitud_documentos);
      console.log(this.lista_nombre_solicitud_documentos);
      console.log(this.lista_descripcion_solicitud_documentos);
      console.log(this.lista_tipo_solicitud_documentos);
    }

    eliminarPreguntaAvance(index: number){
      console.log("eliminando pregunta", index);
      this.lista_preguntas_avance.splice(index, 1);
      this.lista_opciones_preguntas_avance.splice(index, 1);
      this.tipos_preguntas_avance.splice(index, 1);
    }

    eliminarPreguntaFinal(index: number){
      console.log("eliminando pregunta", index);
      this.lista_preguntas_final.splice(index, 1);
      this.lista_opciones_preguntas_final.splice(index, 1);
      this.tipos_preguntas_final.splice(index, 1);
    }

    eliminarPreguntaEncuesta(index: number){
      console.log("eliminando pregunta", index);
      this.lista_preguntas_encuesta.splice(index, 1);
      this.lista_opciones_preguntas_encuesta.splice(index, 1);
      this.tipos_preguntas_encuesta.splice(index, 1);
    }

    eliminarPreguntaSupervisor(index: number){
      console.log("eliminando pregunta", index);
      this.lista_preguntas_supervisor.splice(index, 1);
      this.lista_opciones_preguntas_supervisor.splice(index, 1);
      this.tipos_preguntas_supervisor.splice(index, 1);
    }

    eliminarSolicitudDocumento(index: number){
      console.log("eliminando solicitud de documento", index);
      this.lista_nombre_solicitud_documentos.splice(index, 1);
      this.lista_descripcion_solicitud_documentos.splice(index, 1);
      this.lista_tipo_solicitud_documentos.splice(index, 1);
    }

    eliminarRamo(index: number){
      console.log("eliminando ramo", index);
      this.lista_ramos.splice(index, 1);
    }
  
    mandarDatos() {

        var opciones_ramos = ""
        for (let i = 0; i < this.lista_ramos.length; i++) {
            opciones_ramos = opciones_ramos + this.lista_ramos[i]
            opciones_ramos = opciones_ramos + ";;"
        }
        opciones_ramos = opciones_ramos.slice(0, -2);

        //agregando pregunta de ramos
        this.lista_preguntas_encuesta.push("Selecciona los ramos que fueron mas utiles durante tu practica");
        this.tipos_preguntas_encuesta.push("casillas");
        this.lista_opciones_preguntas_encuesta.push(opciones_ramos);

        //console.log("lista_preguntas_encuesta: ", this.lista_preguntas_encuesta);
        //console.log("tipos_preguntas_encuesta: ", this.tipos_preguntas_encuesta);
        //console.log("lista_opciones_preguntas_encuesta: ", this.lista_opciones_preguntas_encuesta);

        let respuestas = [];
        let respuesta: any = {};
        
        let modalidad: string;
        let tipo_entrada: string;

        // tipo de request
        if (this.nombre_config == "blanco") {
            tipo_entrada = "crear";
        } else {
            tipo_entrada = "actualizar";
        }

        // request con horas
        if (this.horas == true) {
            modalidad = "horas";

            //requests tabla config practica
            for (let i = 0; i < Object.keys(this.opcion_horas).length; i++) {
                console.log("datos a mandar: ", {
                    nombre: this.nombrePractica,
                    modalidad: modalidad,
                    cantidad_tiempo: Number(Object.values(Object.values(this.opcion_horas)[i])[0]),
                    frecuencia_informes: this.frecuenciaInformes,
                    informe_final: this.informeFinal
                });

                this.serviceComplete.crearConfigPracticaFila(this.nombrePractica, modalidad, Number(Object.values(Object.values(this.opcion_horas)[i])[0]), 
                    this.frecuenciaInformes, this.informeFinal).subscribe({
                    next: (data: any) => {
                        respuesta = { ...respuesta, ...data }
                    },
                    error: (error: any) => {
                        this._snackBar.open("Error al guardar configuracion de practica", "Cerrar", {
                            duration: 3500,
                            panelClass: ['red-snackbar']
                        });
                        console.log("Error al guardar configuracion de practica", error);
                    },
                    complete: () => {
                        console.log("respuesta mandarDatos:", respuesta.body)
                        respuestas.push(respuesta.body); //no manda el ID, agregarlo en el back
                        this._snackBar.open("Configuracion de practica guardada exitosamente", "Cerrar", {
                            duration: 3500,
                            panelClass: ['green-snackbar']
                        });
                        console.log("Configuracion de practica guardada exitosamente");

                        if (this.informeFinal == "si") {
                            this.crearConfigInforme(respuesta.body.id, "informe final")
                        }
                        if (this.frecuenciaInformes != "sinAvance") {
                            this.crearConfigInforme(respuesta.body.id, "informe avance") //mandando 2 request simultaneos?
                        }
                    }
                });
            }
        }

        // request con meses
        if (this.meses == true) {
            modalidad = "meses";

            for (let i = 0; i < Object.keys(this.opcion_meses).length; i++) {
                this.serviceComplete.crearConfigPracticaFila(this.nombrePractica, modalidad, Number(Object.values(Object.values(this.opcion_meses)[i])[0]), 
                    this.frecuenciaInformes, this.informeFinal).subscribe({
                    next: (data: any) => {
                        respuesta = { ...respuesta, ...data }
                    },
                    error: (error: any) => {
                        this._snackBar.open("Error al guardar configuracion de practica", "Cerrar", {
                            duration: 3500,
                            panelClass: ['red-snackbar']
                        });
                        console.log("Error al guardar configuracion de practica", error);
                    },
                    complete: () => {
                        console.log("respuesta mandarDatos:", respuesta.body)
                        respuestas.push(respuesta.body);
                        this._snackBar.open("Configuracion de practica guardada exitosamente", "Cerrar", {
                            duration: 3500,
                            panelClass: ['green-snackbar']
                        });
                        console.log("Configuracion de practica guardada exitosamente");
                    }
                });
            }

        }
    }

    crearConfigInforme(id_config_practica: number, tipoInforme: string) {
        let respuesta: any = {};

        this.serviceComplete.crearConfigInforme(id_config_practica, tipoInforme).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al guardar configuracion de informe", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al guardar configuracion de informe", error);
            },
            complete: () => {
                this._snackBar.open("Configuracion de informe guardada exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });
                if (tipoInforme == "informe final") {
                    for (let i = 0; i < this.lista_preguntas_final.length; i++) {
                        this.crearPreguntaInforme(respuesta.body.id, this.lista_preguntas_final[i], this.tipos_preguntas_final[i], this.lista_opciones_preguntas_final[i]);
                    }
                }
                if (tipoInforme == "informe avance") {
                    for (let i = 0; i < this.lista_preguntas_avance.length; i++) {
                        this.crearPreguntaInforme(respuesta.body.id, this.lista_preguntas_avance[i], this.tipos_preguntas_avance[i], this.lista_opciones_preguntas_avance[i]);
                    }
                }
            }
        });
    }

    crearPreguntaInforme(id_config_informe: number, pregunta: string, tipo_pregunta: string, opciones: string) {
        let respuesta: any = {};

        this.serviceComplete.crearPreguntaInforme(id_config_informe, pregunta, tipo_pregunta, opciones).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al guardar pregunta de informe", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al guardar pregunta de informe", error);
            },
            complete: () => {
                this._snackBar.open("Pregunta de informe guardada exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });
                console.log("Pregunta de informe guardada exitosamente");
            }
        });
    }

}

//lista_preguntas_final: string[] = [];
//tipos_preguntas_final: string[] = [];
//lista_opciones_preguntas_final: string[] = [];