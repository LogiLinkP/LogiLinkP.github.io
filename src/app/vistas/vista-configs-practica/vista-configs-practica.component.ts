import { Component } from '@angular/core';
import { ConfigService } from 'src/app/servicios/encargado/config-practica/config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-vista-configs-practica',
  templateUrl: './vista-configs-practica.component.html',
  styleUrls: ['./vista-configs-practica.component.scss']
})
export class VistaConfigsPracticaComponent {
	disabled: boolean = true;
	user: any = JSON.parse(localStorage.getItem('auth-user') || "{}").userdata;
	configs: any = {};
	flag: boolean = false;
	practicasForm: FormGroup;
	
	constructor(private service: ConfigService, private snackBar: MatSnackBar, private _fb: FormBuilder) {
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

				this.practicasForm = this._fb.group({
					practicas: this._fb.array([
						this._fb.group({
							nombre: ['', [Validators.required]]
						})
					])
				});
			}
		});
	}

	initPracticaCard(): void {
		const practicasArray = <FormArray>this.practicasForm.controls['practicas'];
		practicasArray.push(this._fb.group({
			nombre: ['', [Validators.required]]
		}));
	}

	crearSimple() {

	}
}
