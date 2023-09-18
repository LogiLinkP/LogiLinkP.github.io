import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router, Event } from '@angular/router';
import { ChangeDetectorRef, Component, Inject} from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { RamosService } from 'src/app/servicios/encargado/ramos/ramos.service';

@Component({
  selector: 'app-ramos-encargado',
  templateUrl: './ramos-encargado.component.html',
  styleUrls: ['./ramos-encargado.component.scss']
})
export class RamosEncargadoComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private cd: ChangeDetectorRef,
        private service: RamosService,
        @Inject(DOCUMENT) private document: Document
    ) { 
        this.requestInicial();
    }

    ramoFORM = new FormControl('');
    ramo: string;
    lista_ramos: string[] = [];
    fg!: FormGroup;

    user: any = window.localStorage.getItem('auth-user');
    id_carrera: number = JSON.parse(this.user).userdata.encargado.id_carrera;

    requestInicial() {
        let respuesta: any = {};
        let id_carrera;

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
                //console.log("respuesta", respuesta);
                let ramos = respuesta.body.ramos.split(",");
                for (let i = 0; i < ramos.length; i++) {
                    this.lista_ramos.push(ramos[i]);
                }
                this.generarForm();
            }
        });
    }

    generarForm() {
        this.fg = this.fb.group({
            ramoFORM: [this.ramo, Validators.required]
        });
    }

    onSubmitAddRamo() {
        this.ramo = this.fg.value.ramoFORM;
        this.lista_ramos.push(this.ramo);
        console.log(this.lista_ramos);
  
        this.ramo = "";
    }

    eliminarRamo(index: number) {
        console.log("eliminando ramo", index);
        this.lista_ramos.splice(index, 1);
    }

    mandarDatos() {
        let respuesta: any = {};

        console.log("mandando datos");
        console.log(this.lista_ramos);
        let ramos: string = "";

        for (let i = 0; i < this.lista_ramos.length; i++) {
            if (i == this.lista_ramos.length) {
                ramos = ramos + this.lista_ramos[i];
            } else {
                ramos = ramos + this.lista_ramos[i] + ",";
            }
        }

        this.service.actualizarRamos(this.id_carrera, ramos).subscribe({
            next: (data: any) => {
                respuesta = { ...respuesta, ...data }
            },
            error: (error: any) => {
                this.snackBar.open("Error al guardar modalidad", "Cerrar", {
                    duration: 3500,
                    panelClass: ['red-snackbar']
                });
                console.log("Error al guardar modalidad", error);
            },
            complete: () => {
                this.snackBar.open("Modalidad guardada exitosamente", "Cerrar", {
                    duration: 3500,
                    panelClass: ['green-snackbar']
                });
                console.log("Modalidad guardada exitosamente");
            }
        });
    }

    scrollToTop(): void {
        this.document.body.scrollTop = 0;
        this.document.documentElement.scrollTop = 0;
    }
}
