import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edicion-simple-modal',
  templateUrl: './edicion-simple-modal.component.html',
  styleUrls: ['./edicion-simple-modal.component.scss']
})
export class EdicionSimpleModalComponent implements OnInit {
	@Input()
    seccion: string;

    @Output() mandarDatosMigrar = new EventEmitter<string>();

	constructor(private fb: FormBuilder) {}

	editarForm: FormGroup;
	errors: boolean = true;

	ngOnInit(): void {
		this.editarForm = this.fb.group({
			nombre: ['', [Validators.required, Validators.minLength(3)]]
		});
		this.print();
	}

	check() {
		if (this.editarForm.dirty && this.editarForm.invalid) {
			this.errors = true;
		} else {
			this.errors = false;
		}
	}

	reset() {
		this.editarForm.reset();
		this.errors = false;
	}

	guardar() {
		this.mandarDatosMigrar.emit(this.editarForm.value.nombre);
	}

	print() {
		console.log(this.editarForm);
	}
}
