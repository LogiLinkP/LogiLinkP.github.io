import { Component, OnInit } from '@angular/core';
import { GestionarService } from '../../servicios/alumno/gestionar_practica.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router"


@Component({
  selector: 'app-finalizacion',
  templateUrl: './finalizacion.component.html',
  styleUrls: ['./finalizacion.component.css']
})
export class FinalizacionComponent {
  id_estudiante: number = -1;
  id_practica: number = -1;
  private sub: any;

  constructor(private service: GestionarService, private route: ActivatedRoute, private _snackBar: MatSnackBar, private router: Router) {
    this.sub = this.route.params.subscribe(params => {
      this.id_estudiante = +params['id'] - 1; // (+) converts string 'id' to a number
      this.id_practica = +params['n'];
    });
  }

  ngOnInit() {

  }

  finalizar() {
    let resultado: any = {};
    this.service.finalizar_practica(this.id_estudiante, this.id_practica, "Finalizada").subscribe(
      {
        next: data => {
          resultado = { ...resultado, ...data };
        },
        error: error => {
          this._snackBar.open("Se ha producido un error interno", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 3000
          });
        },
        complete: () => {
          this._snackBar.open("Estado de práctica actualizado", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 3000
          })
          this.router.navigate(['/'])
        }
      }
    );
  }
}
