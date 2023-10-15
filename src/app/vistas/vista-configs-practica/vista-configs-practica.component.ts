import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EdicionService } from 'src/app/servicios/encargado/edicion-simple/edicion.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-vista-configs-practica',
  templateUrl: './vista-configs-practica.component.html',
  styleUrls: ['./vista-configs-practica.component.scss']
})
export class VistaConfigsPracticaComponent implements OnInit{
	disabled: boolean = true; //const
	string_bloqueo: string = "Se requiere usar la configuración avanzada"
	crearForm: FormGroup;

	practica_default = 
	{
        "nombre": "Práctica 1",
        "frecuencia_informes": "semanal",
        "informe_final": "si",
        "modalidads": [
            {
                "tipo_modalidad": "meses",
                "cantidad_tiempo": 1
            },
            {
                "tipo_modalidad": "meses",
                "cantidad_tiempo": 2
            },
            {
                "tipo_modalidad": "horas",
                "cantidad_tiempo": 180
            },
			{
				"tipo_modalidad": "horas",
				"cantidad_tiempo": 360
			}
        ],
        "config_informes": [
            {
                "tipo_informe": "Informe avance",
                "pregunta_informes": [
                    {
                        "enunciado": "Describa el trabajo realizado",
                        "tipo_respuesta": "abierta",
                        "opciones": ""
                    }
                ]
            },
            {
                "tipo_informe": "Informe final",
                "pregunta_informes": [
                    {
                        "enunciado": "Que conocimientos adquirió trabajando en la empresa",
                        "tipo_respuesta": "abierta",
                        "opciones": ""
                    },
                    {
                        "enunciado": "Describa el trabajo realizado durante la práctica",
                        "tipo_respuesta": "abierta",
                        "opciones": ""
                    }
                ]
            }
        ],
        "solicitud_documentos": [
			{
				"tipo_archivo": "informe avance",
				"enunciado": ""
			},
			{
				"tipo_documento": "informe final",
				"cantidad_documentos": 3
			}
		],
        "pregunta_supervisors": [
            {
                "enunciado": "Evalúe entre 1 y 5 las siguientes aptitudes del practicante",
                "tipo_respuesta": "evaluacion",
                "opciones": "Responsable;;Puntual;;Comprometido;;Iniciativa"
            },
            {
                "enunciado": "¿Consideraría contratar a este practicante?",
                "tipo_respuesta": "alternativas",
                "opciones": "Sí;;No;;No sé"
            },
            {
                "enunciado": "Describa el trabajo realizado por el practicante",
                "tipo_respuesta": "abierta",
                "opciones": ""
            }
        ],
        "pregunta_encuesta_finals": [
            {
                "enunciado": "Le gustaría continuar trabajando en la empresa donde realizó su práctica",
                "tipo_respuesta": "alternativas",
                "opciones": "Sí;;No;;No sé"
            }
        ]
    };

	user: any = JSON.parse(localStorage.getItem('auth-user') || "{}").userdata;
	configs: any = {};
	flag: boolean = false;

	seccion_edit: string;
	practica_edit_id: number;
	practica_edit: any;
	
	constructor(private service: ConfigService, private serviceEdicion: EdicionService, private snackBar: MatSnackBar, private fb: FormBuilder) {
		//console.log("user: ", this.user);

		this.crearForm = this.fb.group({
			nombre: [this.practica_default.nombre, [Validators.required, Validators.minLength(3)]],
			//meses: [meses, [Validators.required]],
			//horas: [horas, [Validators.required]],
			frecuencia_informes: [this.practica_default.frecuencia_informes, [Validators.required]],
			informe_final: [this.practica_default.informe_final, [Validators.required]]
		});

		let respuesta: any = {};
		this.service.getConfigsCarrera(this.user.encargado.id_carrera).subscribe({
			next: (data: any) => {
				respuesta = { ...respuesta, ...data }
			},
			error: (error: any) => {
				this.snackBar.open("Error al buscar configuraciones", "Cerrar", {
					duration: 3000,
					panelClass: ['red-snackbar']
				});
				console.log("Error al buscar config practica", error);
			},
			complete: () => {
				//console.log("request grande:", respuesta.body);
				this.configs = respuesta.body;

				for (let i = 0; i < this.configs.length; i++) {
					if (this.configs[i].frecuencia_informes == "sinAvance") {
						this.configs[i].frecuencia_informes = "Sin informe de avance";
					}
				}

				this.flag = true;
				//console.log("configs: ", this.configs);
			}
		});
	}

	ngOnInit(): void {
		console.log(this.crearForm);
		this.crearForm.valueChanges.subscribe(change => {
			console.log(change);
		});
	}

	editarSimple(input: any) {
		console.log("event: ", input);
		console.log("practica", this.practica_edit_id);

		let id_practica: number = this.configs[this.practica_edit_id].id;

		let respuesta: any = {};
		this.serviceEdicion.actualizarConfigPractica(id_practica, input[0], input[1], input[2]).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this.snackBar.open("Error al actualizar configuración de práctica", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
				console.log("Error al actualizar config practica", error);
            },
            complete: () => {
                this.snackBar.open("Configuración de práctica actualizada exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });
				window.location.reload();
            }
        });
	}

	crearSimple() {
		let valores = this.crearForm.value;
		let respuesta: any = {};

		this.service.crearConfigPractica(valores.nombre, valores.frecuencia_informes, valores.informe_final, this.user.encargado.id_carrera).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this.snackBar.open("Error al crear configuración de práctica", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
				console.log("Error al crear config practica", error);
            },
            complete: () => {
                this.snackBar.open("Configuración de práctica creada exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });
				setTimeout(() => {
					window.location.reload();
				}, 3000);
            }
        });

		window.location.reload();
	}
}
