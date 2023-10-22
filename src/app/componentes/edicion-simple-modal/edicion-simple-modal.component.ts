import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edicion-simple-modal',
  templateUrl: './edicion-simple-modal.component.html',
  styleUrls: ['./edicion-simple-modal.component.scss']
})
export class EdicionSimpleModalComponent implements OnInit {
	@Input() seccion: string;
	@Input() practica: any;
	@Input() tiene_alumnos: boolean;

    @Output() mandarNombre = new EventEmitter<string>();
	@Output() mandarMeses = new EventEmitter<string>();
	@Output() mandarHoras = new EventEmitter<boolean>();
	@Output() completo = new EventEmitter<any>();

	editarForm: FormGroup;
	errors: boolean = true; //se sobreescribe el valor false cuando se apreto cancelar

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.editarForm = this.fb.group({
			nombre: ['', [Validators.required, Validators.minLength(3)]],
			frecuencia_informes: ['', [Validators.required]],
			informe_final: ['', [Validators.required]]
		});

		//console.log(this.editarForm);
		this.editarForm.valueChanges.subscribe(change => {
			if (this.editarForm.dirty && this.editarForm.invalid) {
				this.errors = true;
			} else {
				this.errors = false;
			}
			//console.log(change);
		});
	}

	//cuando cambie la practica, se actualiza el formulario
	ngOnChanges() {
		if (this.practica) {
			let frecu_informe_aux = this.practica.frecuencia_informes.toLowerCase().trim();
			if(frecu_informe_aux =="sin informe de avance"){
				frecu_informe_aux = "sinAvance";
			}
			this.editarForm.setValue({
				nombre: this.practica.nombre,
				frecuencia_informes: frecu_informe_aux,
				informe_final: this.practica.informe_final
			});
			
		}
	}

	reset() {
		this.editarForm.reset();
		this.errors = false;
	}

	guardar() {
		//console.log("guardar", this.editarForm);
		this.mandarNombre.emit(this.editarForm.value.nombre); 
		this.mandarMeses.emit(this.editarForm.value.frecuencia_informes);
		this.mandarHoras.emit(this.editarForm.value.informe_final);
		this.completo.emit([this.editarForm.value.nombre, this.editarForm.value.frecuencia_informes, this.editarForm.value.informe_final]);
	}
}
