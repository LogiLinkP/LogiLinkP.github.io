import { Component, Input } from '@angular/core';
import { SetDetallesAlumnoService } from '../../servicios/encargado/decision.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss']
})
export class RevisionComponent {
  @Input() id_estudiante: number = -1;
  @Input() id_config_practica: number = -1;
  @Input() id_usuario_estudiante: number = -1; 
  private sub: any;

  constructor(private service: SetDetallesAlumnoService, private route: ActivatedRoute, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {

  }

  aprobar(aprobacion: 0 | 1) {
    let respuesta: any = {}
    
    this.service.aprobar_practica(this.id_usuario_estudiante, this.id_estudiante, this.id_config_practica, aprobacion).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        if (respuesta.status == 200) {
          this._snackBar.open("Práctica actualizada", "Cerrar", {
            panelClass: ['green-snackbar'],
            duration: 2000
          });
        } else {
          this._snackBar.open("Se ha producido un error", "Cerrar", {
            panelClass: ['red-snackbar']
          });
        }
        window.location.reload()
      }
    });
    
  }
}
