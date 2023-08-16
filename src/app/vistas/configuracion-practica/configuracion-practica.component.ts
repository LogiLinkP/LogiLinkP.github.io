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

    displayedColumns = ["opcion_pregunta", "eliminar"]
    dataSourcePacks!: MatTableDataSource<any>;

    
    formdata: any;
    //nombrePractica: string;
    //horas: boolean;
    //meses: boolean;
    //cant_horas: string;
    //cant_meses: string;
    //frecuencia_informe: any;
    //informe_final: any;
    tipo_pregrunta: string;

    //title = 'form-array';
  
    fg!: FormGroup
    
    opcion_pregunta = new FormControl('')
    nombrePractica = new FormControl('')
    cant_horas = new FormControl('')
    cant_meses = new FormControl('')
    horas = new FormControl('')
    meses = new FormControl('')
    frecuenciaInformes = new FormControl('')
    informeFinal = new FormControl('')
    pregunta = new FormControl('')
  
    constructor(private _fb: FormBuilder,
      private cd: ChangeDetectorRef) {
  
    }
  
    ngOnInit(): void {
  
      this.fg = this._fb.group({
        opcion_pregunta: this.opcion_pregunta,
        nombrePractica: this.nombrePractica,
        cant_horas: this.cant_horas,
        cant_meses: this.cant_meses,
        horas: this.horas,
        meses: this.meses,
        frecuenciaInformes: this.frecuenciaInformes,
        informeFinal: this.informeFinal,
        pregunta: this.pregunta,
        
        promos: this._fb.array([])

      });
  
    };
  
    get promos() {
      return this.fg.controls["promos"] as FormArray;
    };
  
    addLesson(): void {
  
      const lessonForm = this._fb.group({
        opcion_pregunta: [''],
      });
  
  
      this.promos.push(lessonForm);
      this.dataSourcePacks = new MatTableDataSource(this.promos.controls);
  
      this.cd.detectChanges();
  
    };
  
  
    deleteLesson(lessonIndex: number): void {
  
      this.promos.removeAt(lessonIndex);
      this.dataSourcePacks = new MatTableDataSource(this.promos.controls);
  
    };
  
    onSubmitPractica(){
      this.nombrePractica = this.fg.value.nombrePractica;
      this.horas = this.fg.value.horas;
      this.meses = this.fg.value.meses;
      this.cant_horas = this.fg.value.cant_horas;
      this.cant_meses = this.fg.value.cant_meses;
      this.frecuenciaInformes = this.fg.value.frecuenciaInformes;
      this.informeFinal = this.fg.value.informeFinal;
      console.log(this.nombrePractica);
      console.log(this.horas);
      console.log(this.meses);
      console.log(this.cant_horas);
      console.log(this.cant_meses);
      console.log(this.frecuenciaInformes);
      console.log(this.informeFinal);
    }

    onSubmitAddPregunta() {
      this.pregunta = this.fg.value.pregunta;
      console.log(this.pregunta);
    }

    onSubmitAddOpcion() {
      console.log(this.promos.value)
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
  }
