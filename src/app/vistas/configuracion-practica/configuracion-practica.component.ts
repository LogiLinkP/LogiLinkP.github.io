import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'

import { BarraLateralService } from 'src/app/servicios/encargado/barra-lateral/barra-lateral.service';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';
import { environment } from 'src/environments/environment';
import { Express, response } from 'express'; //! NO BORRAR! SE MUERE TODO. PORQUE? NI IDEA, SALU2 // harold estuvo aquí

@Component({
    selector: 'app-configuracion-practica',
    templateUrl: './configuracion-practica.component.html',
    styleUrls: ['./configuracion-practica.component.scss']
})

export class ConfiguracionPracticaComponent {

    currentRoute: string;
    importada: boolean = false;
    migracion_legal: boolean = true;
    user: any = JSON.parse(localStorage.getItem('auth-user') || "{}").userdata;

    constructor(private _fb: FormBuilder, private cd: ChangeDetectorRef, @Inject(DOCUMENT) private document: Document,
        private serviceBarra: BarraLateralService, private _snackBar: MatSnackBar, private route: ActivatedRoute,
        private serviceComplete: ConfigService, private router: Router) {
        this.currentRoute = "";

        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                // Show loading indicator
                //console.log("NavigationStart:", event.url);
                this.currentRoute = event.url;
            }

            if (event instanceof NavigationEnd) {
                // Hide loading indicator
                this.currentRoute = event.url;
                let ruta_cortada = event.url.split("/");
                //console.log("NavigationEnd:", event.url, "split", ruta_cortada);
                //console.log("current route: ", this.currentRoute);
                if (ruta_cortada[ruta_cortada.length - 1] == "copia") {
                    this.requestInicial(true);
                    this.importada = true;
                } else {
                    this.requestInicial();
                }
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator
                // Present error to user
                console.log("NavigationError:", event.error);
                _snackBar.open("Error al cargar la página", "Cerrar", {
                    duration: 3000,
                    panelClass: ['red-snackbar']
                });
                this.currentRoute = event.url;
            }
        });
    }

    config: any;
    ids_config_informe: number[] = [];
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

    aptitudFORM = new FormControl('')

    aptitud: string;

    nombre_solicitud_documentos: string;
    descripcion_solicitud_documentos: string;
    tipo_solicitud_documentos: string;

    pregunta: string;
    tipo_pregunta: string;

    //decide que se muestra en el html
    estado: string = "configuracion_general";
    habilitarHoras: boolean = false;
    habilitarMeses: boolean = false;

    lista_aptitudes: string[] = [];

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
    lista_fija_preguntas_supervisor: boolean[] = [];

    lista_nombre_solicitud_documentos: string[] = [];
    lista_descripcion_solicitud_documentos: string[] = [];
    lista_tipo_solicitud_documentos: string[] = [];

    splitOpciones(opciones: string) { //hay weas que aparecen con opciones cuando no deberian
        if (opciones == "" || opciones == null) {
            return [];
        }
        return opciones.split(";;");
    }

    scrollToTop(): void {
        this.document.body.scrollTop = 0;
        this.document.documentElement.scrollTop = 0;
    }

    requestInicial(importada: boolean = false) {
        let respuesta: any = {};

        this.route.paramMap.subscribe((params: ParamMap) => {
            this.nombre_config = params.get('nombre');
        })

        //console.log("nombre_config:", this.nombre_config);

        if (this.nombre_config == "blanco") {
            this.generarFormulario(-1);
        } else if (importada) {
            console.log("dentro de importada");
            this.serviceBarra.obtenerConfigPracticaNombre(this.nombre_config).subscribe({
                next: (data: any) => {
                    respuesta = { ...respuesta, ...data }
                },
                error: (error: any) => {
                    this._snackBar.open("Error al buscar configuración de práctica", "Cerrar", {
                        duration: 3000,
                        panelClass: ['red-snackbar']
                    });
                },
                complete: () => {
                    this.config = respuesta.body;
                    this.config.nombre = this.config.nombre + " (copia)";
                    this.generarFormulario(this.config.id);
                }
            });
        } else {
            this.serviceBarra.obtenerConfigPracticaNombre(this.nombre_config).subscribe({
                next: (data: any) => {
                    respuesta = { ...respuesta, ...data }
                },
                error: (error: any) => {
                    this._snackBar.open("Error al buscar configuración de práctica", "Cerrar", {
                        duration: 3000,
                        panelClass: ['red-snackbar']
                    });
                },
                complete: () => {
                    this.config = respuesta.body;
                    //console.log("request practica existente:", this.config);
                    this.generarFormulario(this.config.id);
                }
            });
        }
    }

    generarFormulario(id_config_practica: number, importada: boolean = false) {
        let respuesta: any = {};

        // set valores iniciales
        if (id_config_practica == -1) {
            this.nombrePractica = "Práctica 1";
            this.horas = false;
            this.meses = false;
            this.frecuenciaInformes = "";
            this.informeFinal = "";
            this.tipo_solicitud_documentos = "pdf";

            this.fg = this._fb.group({
                opcion_preguntaFORM: this.opcion_pregunta, //para poder definir tipo de pregunta
                opcion_horasFORM: this.opcion_horas,
                opcion_mesesFORM: this.opcion_meses,

                nombrePractica: new FormControl(this.nombrePractica, Validators.required),
                cant_horas: this.cant_horas,
                cant_meses: this.cant_meses,
                horas: new FormControl(this.horas),
                meses: new FormControl(this.meses),
                frecuenciaInformes: new FormControl(this.frecuenciaInformes, Validators.required),
                informeFinal: new FormControl(this.informeFinal, Validators.required),
                //pregunta: this.preguntaFORM,

                preguntaFORM: this.pregunta,
                aptitudFORM: this.aptitud,

                arregloOpcionesPreguntas: this._fb.array([]),
                arregloHoras: this._fb.array([]),
                arregloMeses: this._fb.array([]),

                //documentos
                nombre_solicitud_documentos: new FormControl(this.nombre_solicitud_documentos),
                descripcion_solicitud_documentos: new FormControl(this.descripcion_solicitud_documentos),
                tipo_solicitud_documentos: new FormControl(this.tipo_solicitud_documentos),
            });

            this.flag = true;

        } else {
            //* set basicos
            this.nombrePractica = this.config.nombre;
            this.frecuenciaInformes = this.config.frecuencia_informes;
            this.informeFinal = this.config.informe_final;

            //* set modalidad
            //console.log("modalidad get id:", id_config_practica);

            this.serviceComplete.getModalidades(id_config_practica).subscribe({
                next: (data: any) => {
                    respuesta = { ...respuesta, ...data }
                },
                error: (error: any) => {
                    this._snackBar.open("Error al buscar modalidades de configuración de práctica", "Cerrar", {
                        duration: 3000,
                        panelClass: ['red-snackbar']
                    });
                },
                complete: () => {
                    //console.log("request modalidades existentes:", respuesta.body);

                    //* set modalidades
                    for (let i = 0; i < respuesta.body.length; i++) {
                        if (respuesta.body[i].tipo_modalidad == "horas") {
                            this.horas = true;
                        }
                        if (respuesta.body[i].tipo_modalidad == "meses") {
                            this.meses = true;
                        }
                    }
                    //console.log("horas:", this.horas, "meses:", this.meses);

                    //* set config informe
                    this.serviceComplete.getConfigInforme(id_config_practica).subscribe({
                        next: (data: any) => {
                            respuesta = { ...respuesta, ...data }
                        },
                        error: (error: any) => {
                            this._snackBar.open("Error al buscar informes de configuración de práctica", "Cerrar", {
                                duration: 3000,
                                panelClass: ['red-snackbar']
                            });
                        },
                        complete: () => {
                            //console.log("request config informe:", respuesta.body);

                            //* guardar id's para poder actualizar mas tarde
                            for (let i = 0; i < respuesta.body.length; i++) {
                                this.ids_config_informe.push(respuesta.body[i].id);
                            }

                            //* set preguntas informe
                            if (respuesta.body?.length) { // el encargado seteó preguntas de informe
                                for (let j = 0; j < respuesta.body.length; j++) {
                                    for (let i = 0; i < respuesta.body[j].pregunta_informes.length; i++) {
                                        if (respuesta.body[j].tipo_informe == "informe final") {
                                            this.lista_preguntas_final.push(respuesta.body[j].pregunta_informes[i].enunciado);
                                            this.tipos_preguntas_final.push(respuesta.body[j].pregunta_informes[i].tipo_respuesta);
                                            this.lista_opciones_preguntas_final.push(respuesta.body[j].pregunta_informes[i].opciones);
                                        }
                                        if (respuesta.body[j].tipo_informe == "informe avance") {
                                            this.lista_preguntas_avance.push(respuesta.body[j].pregunta_informes[i].enunciado);
                                            this.tipos_preguntas_avance.push(respuesta.body[j].pregunta_informes[i].tipo_respuesta);
                                            this.lista_opciones_preguntas_avance.push(respuesta.body[j].pregunta_informes[i].opciones);
                                        }
                                    }
                                }
                            }

                            //* set preguntas encuesta
                            this.serviceComplete.getPreguntaEncuestaFinal(id_config_practica).subscribe({
                                next: (data: any) => {
                                    respuesta = { ...respuesta, ...data }
                                },
                                error: (error: any) => {
                                    this._snackBar.open("Error al buscar encuesta final", "Cerrar", {
                                        duration: 3000,
                                        panelClass: ['red-snackbar']
                                    });
                                    console.log("Error al buscar encuesta final", error);
                                },
                                complete: () => {
                                    //console.log("request encuesta final:", respuesta.body);
                                    for (let i = 0; i < respuesta.body.length; i++) {
                                        this.lista_preguntas_encuesta.push(respuesta.body[i].enunciado);
                                        this.tipos_preguntas_encuesta.push(respuesta.body[i].tipo_respuesta);
                                        this.lista_opciones_preguntas_encuesta.push(respuesta.body[i].opciones);
                                    }

                                    //* set preguntas supervisor
                                    this.serviceComplete.getPreguntaSupervisor(id_config_practica).subscribe({
                                        next: (data: any) => {
                                            respuesta = { ...respuesta, ...data }
                                        },
                                        error: (error: any) => {
                                            this._snackBar.open("Error al buscar pregunta supervisor", "Cerrar", {
                                                duration: 3000,
                                                panelClass: ['red-snackbar']
                                            });
                                            console.log("Error al buscar pregunta supervisor", error);
                                        },
                                        complete: () => {
                                            //console.log("pregunta supervisor:", respuesta.body);
                                            for (let i = 0; i < respuesta.body.length; i++) {
                                                this.lista_preguntas_supervisor.push(respuesta.body[i].enunciado);
                                                this.tipos_preguntas_supervisor.push(respuesta.body[i].tipo_respuesta);
                                                this.lista_opciones_preguntas_supervisor.push(respuesta.body[i].opciones);
                                            }

                                            //* set solicitudes documentos
                                            this.serviceComplete.getSolicitudDocumento(id_config_practica).subscribe({
                                                next: (data: any) => {
                                                    respuesta = { ...respuesta, ...data }
                                                },
                                                error: (error: any) => {
                                                    this._snackBar.open("Error al buscar solicitud de documento", "Cerrar", {
                                                        duration: 3000,
                                                        panelClass: ['red-snackbar']
                                                    });
                                                    console.log("Error al buscar solicitud de documento", error);
                                                },
                                                complete: () => {
                                                    //console.log("request solicitud de documento:", respuesta.body);
                                                    for (let i = 0; i < respuesta.body.length; i++) {
                                                        this.lista_nombre_solicitud_documentos.push(respuesta.body[i].nombre_solicitud);
                                                        this.lista_descripcion_solicitud_documentos.push(respuesta.body[i].descripcion);
                                                        this.lista_tipo_solicitud_documentos.push(respuesta.body[i].tipo_archivo);
                                                    }

                                                    //* set aptitudes
                                                    this.serviceComplete.getAptitudes(id_config_practica).subscribe({
                                                        next: (data: any) => {
                                                            respuesta = { ...respuesta, ...data }
                                                        },
                                                        error: (error: any) => {
                                                            this._snackBar.open("Error al buscar aptitudes", "Cerrar", {
                                                                duration: 3000,
                                                                panelClass: ['red-snackbar']
                                                            });
                                                            console.log("Error al buscar aptitudes", error);
                                                        },
                                                        complete: () => {
                                                            console.log("request aptitudes:", respuesta.body);
                                                            this.lista_aptitudes = respuesta.body.opciones.split(";;");

                                                            //* set formulario
                                                            this.fg = this._fb.group({
                                                                opcion_preguntaFORM: this.opcion_pregunta, //para poder definir tipo de pregunta
                                                                opcion_horasFORM: this.opcion_horas,
                                                                opcion_mesesFORM: this.opcion_meses,

                                                                nombrePractica: new FormControl(this.nombrePractica, Validators.required),
                                                                cant_horas: this.cant_horas,
                                                                cant_meses: this.cant_meses,
                                                                horas: new FormControl(this.horas),
                                                                meses: new FormControl(this.meses),
                                                                frecuenciaInformes: new FormControl(this.frecuenciaInformes, Validators.required),
                                                                informeFinal: new FormControl(this.informeFinal, Validators.required),
                                                                //pregunta: this.preguntaFORM,

                                                                preguntaFORM: this.pregunta,
                                                                aptitudFORM: this.aptitud,

                                                                arregloOpcionesPreguntas: this._fb.array([]),
                                                                arregloHoras: this._fb.array([]),
                                                                arregloMeses: this._fb.array([]),

                                                                //documentos
                                                                nombre_solicitud_documentos: new FormControl(this.nombre_solicitud_documentos),
                                                                descripcion_solicitud_documentos: new FormControl(this.descripcion_solicitud_documentos),
                                                                tipo_solicitud_documentos: new FormControl(this.tipo_solicitud_documentos),
                                                            });
                                                            this.flag = true;
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
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
        else if (this.frecuenciaInformes == "sinAvance" && this.informeFinal == "si") {
            this.estado = "informe_final";
            //console.log("informe final");
        }
        else if (this.frecuenciaInformes != "sinAvance") {
            this.estado = "informe_avance";
            //console.log("informe avance");
        }
        //console.log("estado:", this.estado);
        //console.log("fg values:", this.fg.value);
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

        for (let i = 0; i < this.arregloOpcionesPreguntas.length; i++) {
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
        else {
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

        for (let i = 0; i < this.arregloOpcionesPreguntas.length; i++) {
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
        } else {
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

        for (let i = 0; i < this.arregloOpcionesPreguntas.length; i++) {
            this.deleteOpcionPregunta(i);
        }

        this.arregloOpcionesPreguntas.clear();
        this.pregunta = "";
    }

    onSubmitAddAptitud() {
        this.aptitud = this.fg.value.aptitudFORM;
        this.lista_aptitudes.push(this.aptitud);
        console.log(this.lista_aptitudes);

        this.aptitud = "";
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
        else {
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

        this.lista_fija_preguntas_supervisor.push(false);
        console.log(this.lista_fija_preguntas_supervisor);

        //limpieza opciones anteriores

        for (let i = 0; i < this.arregloOpcionesPreguntas.length; i++) {
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

    lengthArray(array: Array<string>): number {
        return array.length;
    }

    avanzarDesdePreguntasAvance() {
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

    avanzarDesdePreguntasFinal() {
        this.estado = "solicitud_documentos";
        this.printForm();
    }

    avanzarDesdeSolicitudDocumentos() {
        this.estado = "encuesta_final";
        this.printForm();
    }

    avanzarDesdePreguntasEncuesta() {
        //this.estado = "agregar_ramos";
        this.estado = "aptitudes";
        this.printForm();
    }

    avanzarDesdeAptitud() {
        this.estado = "preguntas_supervisor";
        this.printForm();
    }

    avanzarDesdePreguntasSupervisor() {
        this.estado = "fin_configuracion";
        this.printForm();
    }

    volver() {

        //console.log("volver");
        //console.log(this.estado);
        //volver desde preguntas avance
        if (this.estado == "informe_avance") {
            this.estado = "configuracion_general";
        }

        //volver desde preguntas final
        if (this.estado == "informe_final") {
            if (this.frecuenciaInformes == "sinAvance") {
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
        /*
        else if (this.estado == "agregar_ramos") {
          this.estado = "encuesta_final";
        }
        */
        else if (this.estado == "aptitudes") {
            this.estado = "encuesta_final";
        }
        //volver desde preguntas supervisor
        else if (this.estado == "preguntas_supervisor") {
            //this.estado = "agregar_ramos";
            this.estado = "aptitudes";
        }
        //volver desde fin configuracion
        else if (this.estado == "fin_configuracion") {
            this.estado = "preguntas_supervisor";
        }
        //this.printForm();
    }

    printForm() {
        //console.log(this.fg.value);
    }

    onSubmitAddSolicitudDoc() {
        console.log("documento agregado");
        this.lista_nombre_solicitud_documentos.push(this.fg.value.nombre_solicitud_documentos);
        this.lista_descripcion_solicitud_documentos.push(this.fg.value.descripcion_solicitud_documentos);
        this.lista_tipo_solicitud_documentos.push(this.fg.value.tipo_solicitud_documentos);
        //console.log(this.lista_nombre_solicitud_documentos);
        //console.log(this.lista_descripcion_solicitud_documentos);
        //console.log(this.lista_tipo_solicitud_documentos);
    }

    eliminarPreguntaAvance(index: number) {
        console.log("eliminando pregunta", index);
        this.lista_preguntas_avance.splice(index, 1);
        this.lista_opciones_preguntas_avance.splice(index, 1);
        this.tipos_preguntas_avance.splice(index, 1);
        this.migracion_legal = false;
    }

    eliminarPreguntaFinal(index: number) {
        console.log("eliminando pregunta", index);
        this.lista_preguntas_final.splice(index, 1);
        this.lista_opciones_preguntas_final.splice(index, 1);
        this.tipos_preguntas_final.splice(index, 1);
        this.migracion_legal = false;
    }

    eliminarPreguntaEncuesta(index: number) {
        console.log("eliminando pregunta", index);
        this.lista_preguntas_encuesta.splice(index, 1);
        this.lista_opciones_preguntas_encuesta.splice(index, 1);
        this.tipos_preguntas_encuesta.splice(index, 1);
        this.migracion_legal = false;
    }

    eliminarPreguntaSupervisor(index: number) {
        console.log("eliminando pregunta", index);
        this.lista_preguntas_supervisor.splice(index, 1);
        this.lista_opciones_preguntas_supervisor.splice(index, 1);
        this.tipos_preguntas_supervisor.splice(index, 1);
        this.migracion_legal = false;
    }

    eliminarSolicitudDocumento(index: number) {
        console.log("eliminando solicitud de documento", index);
        this.lista_nombre_solicitud_documentos.splice(index, 1);
        this.lista_descripcion_solicitud_documentos.splice(index, 1);
        this.lista_tipo_solicitud_documentos.splice(index, 1);
        this.migracion_legal = false;
    }

    eliminarAptitud(index: number) {
        console.log("eliminando aptitud", index);
        this.lista_aptitudes.splice(index, 1);
        this.migracion_legal = false;
    }

    mandarDatos() { //se estan apilando los snackbars positivos (dejar los negativos)
        let tipo_request: string;

        //checkear si se puede migrar

        // tipo de request
        if (this.nombre_config == "blanco" || this.importada) {
            tipo_request = "crear";
        } else {
            tipo_request = "actualizar";
        }

        if (tipo_request == "crear") {
            this.crearConfigPractica(this.nombrePractica, this.frecuenciaInformes, this.informeFinal);
        } else {
            this.actualizarConfigPractica(this.nombrePractica, this.frecuenciaInformes, this.informeFinal);
        }

    }

    actualizarConfigPractica(nombre: string, frecuencia: string, final: string) {
        let respuesta: any = {};

        //desactivar practica actual
        this.serviceComplete.actualizarConfigPractica(this.config.id, false).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al actualizar configuración de práctica", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
            },
            complete: () => {
                this._snackBar.open("Configuración de práctica actualizada exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });
            }
        });

        //eliminar actuales
        //this.delConfigInforme(this.config.id);
        //this.delPreguntaSupervisor(this.config.id);
        //this.delSolicitudDocumento(this.config.id);
        //this.delPreguntaEncuestaFinal(this.config.id);
        //this.delModalidad(this.config.id);
        //for (let i = 0; i < this.ids_config_informe.length; i++) {
        //    this.delPreguntaInforme(this.ids_config_informe[i]);
        //}

        //crear nuevos (copias)
        this.serviceComplete.crearConfigPractica(nombre, frecuencia, final, +this.user.encargado.id_carrera).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al guardar configuración de práctica", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
            },
            complete: () => {
                this._snackBar.open("Configuración de práctica guardada exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });

                if (this.horas == true) {
                    this.tablaModalidad(respuesta.body.id, "horas", Object.values(this.opcion_horas));
                }
                if (this.meses == true) {
                    this.tablaModalidad(respuesta.body.id, "meses", Object.values(this.opcion_meses));
                }
                for (let i = 0; i < this.lista_preguntas_encuesta.length; i++) {
                    this.crearPreguntaEncuestaFinal(respuesta.body.id, this.lista_preguntas_encuesta[i], this.tipos_preguntas_encuesta[i], this.lista_opciones_preguntas_encuesta[i]);
                }
                for (let i = 0; i < this.lista_preguntas_supervisor.length; i++) {
                    this.crearPreguntaSupervisor(respuesta.body.id, this.lista_preguntas_supervisor[i], this.tipos_preguntas_supervisor[i], this.lista_opciones_preguntas_supervisor[i], this.lista_fija_preguntas_supervisor[i]);
                }
                for (let i = 0; i < this.lista_nombre_solicitud_documentos.length; i++) {
                    this.crearSolicitudDocumento(respuesta.body.id, this.lista_nombre_solicitud_documentos[i], this.lista_descripcion_solicitud_documentos[i], this.lista_tipo_solicitud_documentos[i]);
                }
                if (this.informeFinal == "si") {
                    this.crearConfigInforme(respuesta.body.id, "informe final")
                }
                if (this.frecuenciaInformes != "sinAvance") {
                    this.crearConfigInforme(respuesta.body.id, "informe avance")
                }

                this.serviceComplete.getPracticasConConfig(this.config.id).subscribe({
                    next: (data: any) => {
                        respuesta = { ...respuesta, ...data }
                    },
                    error: (error: any) => {
                        this._snackBar.open("Error al buscar practicas con config", "Cerrar", {
                            duration: 3500,
                            panelClass: ['red-snackbar']
                        });
                        console.log("Error al buscar practicas con config", error);
                    },
                    complete: () => {
                        console.log("request practicas con config:", respuesta.body);

                        if (respuesta.body.length > 0 && this.migracion_legal) {
                            for (let i = 0; i < respuesta.body.length; i++) {
                                this.serviceComplete.actualizarEstudiantes(respuesta.body[i].id, this.config.id).subscribe({
                                    next: (data: any) => {
                                        respuesta = { ...respuesta, ...data }
                                    },
                                    error: (error: any) => {
                                        console.log("Error al actualizar estudiantes", error);
                                    },
                                    complete: () => {
                                        console.log("Estudiantes actualizados exitosamente", respuesta.body);
                                    }
                                });
                            }
                        }
                    }
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        });
    }

    crearConfigPractica(nombre: string, frecuencia: string, final: string) {

        //agregando pregunta aptitudes/evaluacion a preguntas supervisor
        var opciones_aptitudes = ""
        for (let i = 0; i < this.lista_aptitudes.length; i++) {
            opciones_aptitudes = opciones_aptitudes + this.lista_aptitudes[i]
            opciones_aptitudes = opciones_aptitudes + ";;"
        }
        opciones_aptitudes = opciones_aptitudes.slice(0, -2);

        this.lista_preguntas_supervisor.push("Evalúe entre 1 y 5 las siguientes aptitudes del practicante");
        this.tipos_preguntas_supervisor.push("evaluacion");
        this.lista_opciones_preguntas_supervisor.push(opciones_aptitudes);
        this.lista_fija_preguntas_supervisor.push(true);

        let respuesta: any = {};

        this.serviceComplete.crearConfigPractica(nombre, frecuencia, final, +this.user.encargado.id_carrera).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Se ha producido un error al guardar la configuración de práctica", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
            },
            complete: () => {
                this._snackBar.open("Configuración de práctica guardada exitosamente", "Cerrar", {
                    duration: 5000,
                    panelClass: ['green-snackbar']
                });

                if (this.horas == true) {
                    this.tablaModalidad(respuesta.body.id, "horas", Object.values(this.opcion_horas));
                }
                if (this.meses == true) {
                    this.tablaModalidad(respuesta.body.id, "meses", Object.values(this.opcion_meses));
                }
                for (let i = 0; i < this.lista_preguntas_encuesta.length; i++) {
                    this.crearPreguntaEncuestaFinal(respuesta.body.id, this.lista_preguntas_encuesta[i], this.tipos_preguntas_encuesta[i], this.lista_opciones_preguntas_encuesta[i]);
                }
                for (let i = 0; i < this.lista_preguntas_supervisor.length; i++) {
                    this.crearPreguntaSupervisor(respuesta.body.id, this.lista_preguntas_supervisor[i], this.tipos_preguntas_supervisor[i], this.lista_opciones_preguntas_supervisor[i], this.lista_fija_preguntas_supervisor[i]);
                }
                for (let i = 0; i < this.lista_nombre_solicitud_documentos.length; i++) {
                    this.crearSolicitudDocumento(respuesta.body.id, this.lista_nombre_solicitud_documentos[i], this.lista_descripcion_solicitud_documentos[i], this.lista_tipo_solicitud_documentos[i]);
                }
                if (this.informeFinal == "si") {
                    this.crearConfigInforme(respuesta.body.id, "informe final")
                }
                if (this.frecuenciaInformes != "sinAvance") {
                    this.crearConfigInforme(respuesta.body.id, "informe avance")
                }
                this.router.navigate(["/" + environment.ruta_practicas])
            }
        });
    }

    tablaModalidad(id_config_practica: number, tipo_modalidad: string, lista_cant: number[]) {
        let respuesta: any = {};
        for (let i = 0; i < Object.keys(lista_cant).length; i++) {
            this.serviceComplete.crearModalidad(id_config_practica, tipo_modalidad, Number(Object.values(lista_cant[i])[0])).subscribe({
                next: (data: any) => {
                    respuesta = { ...respuesta, ...data }
                },
                error: (error: any) => {
                    this._snackBar.open("Error al guardar modalidad", "Cerrar", {
                        duration: 3500,
                        panelClass: ['red-snackbar']
                    });
                    console.log("Error al guardar modalidad", error);
                },
                complete: () => {
                    console.log("Modalidad guardada exitosamente");
                }
            });
        }
    }

    actualizarTablaModalidad(id_config_practica: number, tipo_modalidad: string, lista_cant: number[]) {
        let respuesta: any = {};
        for (let i = 0; i < Object.keys(lista_cant).length; i++) {
            this.serviceComplete.actualizarModalidad(id_config_practica, tipo_modalidad, Number(Object.values(lista_cant[i])[0])).subscribe({
                next: (data: any) => {
                    respuesta = { ...respuesta, ...data }
                },
                error: (error: any) => {
                    this._snackBar.open("Error al guardar modalidad", "Cerrar", {
                        duration: 3500,
                        panelClass: ['red-snackbar']
                    });
                    console.log("Error al guardar modalidad", error);
                },
                complete: () => {
                    this._snackBar.open("Modalidad guardada exitosamente", "Cerrar", {
                        duration: 3500,
                        panelClass: ['green-snackbar']
                    });
                    console.log("Modalidad guardada exitosamente");
                }
            });
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
                console.log("BUSACR EL ID: ", respuesta);
                if (tipoInforme == "informe final") {
                    for (let i = 0; i < this.lista_preguntas_final.length; i++) {
                        //console.log("lista pregunta final: ", this.lista_preguntas_final[i], "tipos preguntas final: ", this.tipos_preguntas_final[i], "lista opciones preguntas final: ", this.lista_opciones_preguntas_final[i]);
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
        //console.log("pregunta: ", pregunta, "tipo_pregunta: ", tipo_pregunta, "opciones: ", opciones);

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
                console.log("Pregunta de informe guardada exitosamente");
            }
        });
    }

    crearPreguntaEncuestaFinal(id_config_practica: number, pregunta: string, tipo_pregunta: string, opciones: string) {
        let respuesta: any = {};

        this.serviceComplete.crearPreguntaEncuestaFinal(id_config_practica, pregunta, tipo_pregunta, opciones).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al guardar pregunta de encuesta", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al guardar pregunta de encuesta", error);
            },
            complete: () => {
                console.log("Pregunta de encuesta guardada exitosamente");
            }
        });
    }

    crearPreguntaSupervisor(id_config_practica: number, pregunta: string, tipo_pregunta: string, opciones: string, fija: boolean) {
        let respuesta: any = {};

        this.serviceComplete.crearPreguntaSupervisor(id_config_practica, pregunta, tipo_pregunta, opciones, fija).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al guardar pregunta de supervisor", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al guardar pregunta de supervisor", error);
            },
            complete: () => {
                console.log("Pregunta de supervisor guardada exitosamente");
            }
        });
    }

    crearSolicitudDocumento(id_config_practica: number, nombre: string, descripcion: string, tipo: string) {
        let respuesta: any = {};

        this.serviceComplete.crearSolicitudDocumento(id_config_practica, nombre, descripcion, tipo).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al guardar solicitud de documento", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al guardar solicitud de documento", error);
            },
            complete: () => {
                console.log("Solicitud de documento guardada exitosamente");
            }
        });
    }

    delConfigInforme(id_config_practica: number) {
        let respuesta: any = {};

        this.serviceComplete.delConfigInforme(id_config_practica).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al eliminar configuracion de informe", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al eliminar configuracion de informe", error);
            },
            complete: () => {
                this._snackBar.open("Configuracion de informe eliminada exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });
                console.log("Configuracion de informe eliminada exitosamente");
            }
        });
    }

    delModalidad(id_config_practica: number) {
        let respuesta: any = {};

        this.serviceComplete.delModalidad(id_config_practica).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al eliminar modalidad", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al eliminar modalidad", error);
            },
            complete: () => {
                this._snackBar.open("modalidad eliminada exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });
                console.log("modalidad eliminada exitosamente");
            }
        });
    }

    delPreguntaInforme(id_config_informe: number) {
        let respuesta: any = {};

        this.serviceComplete.delPreguntaInforme(id_config_informe).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al eliminar pregunta de informe", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al eliminar pregunta de informe", error);
            },
            complete: () => {
                console.log("Pregunta de informe eliminada exitosamente");
            }
        });
    }

    delPreguntaEncuestaFinal(id_config_practica: number) {
        let respuesta: any = {};

        this.serviceComplete.delPreguntaEncuestaFinal(id_config_practica).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al eliminar pregunta de encuesta", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al eliminar pregunta de encuesta", error);
            },
            complete: () => {
                console.log("Pregunta de encuesta eliminada exitosamente");
            }
        });
    }

    delPreguntaSupervisor(id_config_practica: number) {
        let respuesta: any = {};

        this.serviceComplete.delPreguntaSupervisor(id_config_practica).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al eliminar pregunta de supervisor", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al eliminar pregunta de supervisor", error);
            },
            complete: () => {
                console.log("Pregunta de supervisor eliminada exitosamente");
            }
        });
    }

    delSolicitudDocumento(id_config_practica: number) {
        let respuesta: any = {};

        this.serviceComplete.delSolicitudDocumento(id_config_practica).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this._snackBar.open("Error al eliminar solicitud de documento", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al eliminar solicitud de documento", error);
            },
            complete: () => {
                console.log("Solicitud de documento eliminada exitosamente");
            }
        });
    }

}