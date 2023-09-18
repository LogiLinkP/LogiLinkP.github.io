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

    requestInicial() {
        let respuesta: any = {};
        let id_carrera;

        const user = window.localStorage.getItem('auth-user');
        if (user) {
          id_carrera = JSON.parse(user).userdata.encargado.id_carrera;
        }

        this.service.getRamos(id_carrera).subscribe({
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
        //console.log(this.lista_ramos);
  
        this.ramo = "";
    }

    eliminarRamo(index: number) {
        console.log("eliminando ramo", index);
        this.lista_ramos.splice(index, 1);
    }

    mandarDatos() {
        console.log("mandando datos");
        console.log(this.lista_ramos);
    }

    scrollToTop(): void {
        this.document.body.scrollTop = 0;
        this.document.documentElement.scrollTop = 0;
    }
}
