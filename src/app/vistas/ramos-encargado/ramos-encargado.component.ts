import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { ChangeDetectorRef, Component, Inject} from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'

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
        @Inject(DOCUMENT) private document: Document
    ) { 
        this.generarForm();
    }

    ramoFORM = new FormControl('');
    ramo: string = "";
    lista_ramos: string[] = [];
    fg!: FormGroup;

    generarForm() {
        this.fg = this.fb.group({
            ramoFORM: this.ramo
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

    scrollToTop(): void {
        this.document.body.scrollTop = 0;
        this.document.documentElement.scrollTop = 0;
    }
}
