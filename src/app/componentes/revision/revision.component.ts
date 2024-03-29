import { Component, Input } from '@angular/core';
import { SetDetallesAlumnoService } from '../../servicios/encargado/decision.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss']
})
export class RevisionComponent {
  @Input() id_estudiante: number = -1;
  @Input() id_modalidad: number = -1;
  @Input() id_usuario_estudiante: number = -1; 
  @Input() estado_practica: string = "";
  private sub: any;

  cambiar_estado: boolean = true;
  estado_config: string = ""
  correo_estudiante: string= ""
  respuesta: any = [];

  constructor(private service: SetDetallesAlumnoService, private route: ActivatedRoute,
              private _snackBar: MatSnackBar, private service_obtener: DataUsuarioService,
              private service_noti: NotificacionesService) {
  }

  ngOnInit() {
    if (this.estado_practica == "Aprobada" || this.estado_practica == "Reprobada") {
      this.cambiar_estado = false;
    }
    this.service_obtener.obtener_estudiante(this.id_usuario_estudiante).subscribe({
      next:(data:any) => {
        this.respuesta = {...this.respuesta, ...data};
      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        this.correo_estudiante = this.respuesta.body.usuario.correo;
        this.estado_config = this.respuesta.body.usuario.config;
      }
    })
  }

  aprobar(aprobacion: 0 | 1) {
    let respuesta: any = {}
    
    //console.log("la modalidad es: ", this.id_modalidad);

    this.service.aprobar_practica(this.id_estudiante, this.id_modalidad, aprobacion).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        let mensaje:string = "";
        if(aprobacion == 0){
          mensaje = "Desafortunadamente, has reprobado esta práctica";
        }
        else{
          mensaje = "Felicidades, has aprobado esta práctica";
        }
        let enlace = environment.url_front + "/alumno/" + this.id_estudiante;

        this.service_noti.postnotificacion(this.id_estudiante, mensaje, this.correo_estudiante, this.estado_config, enlace).subscribe({
          next:(data:any) => {
            respuesta = {...respuesta, ...data}
          },
          error:(error:any) => {
            console.log(error);
            return
          },
          complete:() => {
            console.log("Notificación de resultado de revisión exitosa");
          }
        })

        
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

  cambiarEstado() {
    this.cambiar_estado = !this.cambiar_estado;
  }
}
