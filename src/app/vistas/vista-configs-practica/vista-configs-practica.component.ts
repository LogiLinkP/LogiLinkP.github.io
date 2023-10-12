import { Component } from '@angular/core';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
	
	constructor(private service: ConfigService, private snackBar: MatSnackBar) {
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
				this.flag = true; //mover para abajo
				console.log("configs: ", this.configs);
			}
		});
	}

	crearSimple() {}
}
