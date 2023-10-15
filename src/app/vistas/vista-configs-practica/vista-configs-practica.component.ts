import { Component } from '@angular/core';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EdicionService } from 'src/app/servicios/encargado/edicion-simple/edicion.service';

@Component({
  selector: 'app-vista-configs-practica',
  templateUrl: './vista-configs-practica.component.html',
  styleUrls: ['./vista-configs-practica.component.scss']
})
export class VistaConfigsPracticaComponent {
	disabled: boolean = true; //const

	user: any = JSON.parse(localStorage.getItem('auth-user') || "{}").userdata;
	configs: any = {};
	flag: boolean = false;

	seccion_edit: string;
	practica_edit_id: number;
	
	constructor(private service: ConfigService, private serviceEdicion: EdicionService, private snackBar: MatSnackBar) {
		//console.log("user: ", this.user);

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
				console.log("configs: ", this.configs);
			}
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

	crearSimple() {}
}
