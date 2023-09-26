import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RamosService } from 'src/app/servicios/encargado/ramos/ramos.service';

@Component({
  selector: 'app-ramos-encargado',
  templateUrl: './ramos-encargado.component.html',
  styleUrls: ['./ramos-encargado.component.scss']
})
export class RamosEncargadoComponent {

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private service: RamosService,
        @Inject(DOCUMENT) private document: Document
    ) { 
        this.requestInicial();
        this.generarForm();
    }

    ramoFORM = new FormControl('');
    ramo: string;
    lista_ramos: string[] = [];
    fg!: FormGroup;

    user: any = window.localStorage.getItem('auth-user');
    id_carrera: number = JSON.parse(this.user).userdata.encargado.id_carrera;
    nombre_carrera: string;
    ramos_elminados: boolean = false;

    requestInicial() {
        let respuesta: any = {};

        this.service.getRamos(this.id_carrera).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this.snackBar.open("Error al buscar ramos", "Cerrar", {
                duration: 3000,
                panelClass: ['red-snackbar']
                });
                console.log("Error al buscar ramos", error);
            },
            complete: () => {
                this.nombre_carrera = respuesta.body.nombre;
                let ramos = respuesta.body.ramos.split(",");
                for (let i = 0; i < ramos.length; i++) {
                    if (ramos[i] != "") {
                        this.lista_ramos.push(ramos[i]);
                    }
                }
                //this.generarForm();
            }
        });
    }

    generarForm() {
        this.fg = this.fb.group({
            ramoFORM: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    onSubmitAddRamo() {
        this.ramo = this.fg.value.ramoFORM;
        this.lista_ramos.push(this.ramo);
        //console.log(this.lista_ramos);
        
        this.fg.reset();
    }

    eliminarRamo(index: number) {
        //console.log("eliminando ramo", index);
        this.lista_ramos.splice(index, 1);
    }

    mandarDatos() {
        let respuesta: any = {};

        console.log("mandando datos");
        let ramos: string = "";

        for (let i = 0; i < this.lista_ramos.length; i++) {
            if (i == this.lista_ramos.length - 1) {
                ramos = ramos + this.lista_ramos[i];
            } else {
                ramos = ramos + this.lista_ramos[i] + ",";
            }
        }

        console.log("lista original:", this.lista_ramos, "ramos:", ramos);
        this.service.actualizarRamos(this.id_carrera, ramos).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this.snackBar.open("Error al guardar cambios", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al guardar ramos", error);
            },
            complete: () => {
                this.snackBar.open("Los cambios han sido guardados exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });
                console.log("Ramos guardados exitosamente");
            }
        });
    }

    scrollToTop(): void {
        this.document.body.scrollTop = 0;
        this.document.documentElement.scrollTop = 0;
    }
}