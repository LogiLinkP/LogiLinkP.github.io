import { Component, OnInit} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { GestionarService } from 'src/app/servicios/alumno/gestionar_practica.service';
import { SupervisorService } from 'src/app/servicios/supervisor/supervisor.service';
import { Router } from "@angular/router"

@Component({
  selector: 'alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss']
})
export class DetalleAlumnoComponent implements OnInit{
  id_usuario: number = -1;
  estudiante:any = [];  
  config_practica: any = [];
  practicas: any = [];
  //Se deberían mostrar todos los tipos de practica que se pueden realizar - el desafío aquí es
  //que definimos que en la tabla se van a repetir los nombres para cada modalidad de tiempo, por ejemplo
  //por lo que hay que preocuparse de extraer sólo los nombres distintos
  nombres_distintos_config_practica: any = [];
  //Además, va ha haber que hacer una correspondencia entre la práctica que está dando el estudiante y la
  //posición del nombre en el arreglo anterior, por lo que se crea un arreglo de arreglos, que va a tener
  //como primer elemento el nombre de la práctica y como segundo elemento la practica de ese tipo, si es que la está realizando
  practicas_correspondiente_nombre: any = [];
  
  flags_inscripcion_list: boolean[] = [];
  link_finalizacion = ""
  link_inscripcion = ""
  doc_str = "documento";
  doc_extra_str = "documento_extra";

  constructor(private service_datos: ObtenerDatosService , private activated_route: ActivatedRoute, private _snackBar: MatSnackBar, 
              private service_gestion: GestionarService, private service_supervisor: SupervisorService, private router: Router) {
    this.id_usuario = parseInt(this.activated_route.snapshot.paramMap.get('id') || "-1");
  }

  ngOnInit() {
    const param_upload_success = this.activated_route.snapshot.queryParamMap.get('upload_success');

    console.log("PARAMETRO URL",param_upload_success);
    if (param_upload_success == "success") {
      this._snackBar.open("Archivo subido correctamente", "Cerrar", {
        panelClass: ['green-snackbar'],
        duration: 3000
      });
    } else if (param_upload_success == "format") {
      this._snackBar.open("Archivo con formato incorrecto", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
    } else if (param_upload_success == "error") {
      this._snackBar.open("Error al subir archivo", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
    }

    const param_inscripcion_success = this.activated_route.snapshot.queryParamMap.get('inscripcion_success');
    if (param_inscripcion_success == "success") {
      this._snackBar.open("Práctica inscrita correctamente", "Cerrar", {
        panelClass: ['green-snackbar'],
        duration: 3000
      });
    } else if (param_inscripcion_success == "error") {
      this._snackBar.open("Error al inscribir práctica", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
    }


    const param_finalizacion_success = this.activated_route.snapshot.queryParamMap.get('finalizacion_success');
    if (param_finalizacion_success == "success") {
      this._snackBar.open("Práctica finalizada correctamente", "Cerrar", {
        panelClass: ['green-snackbar'],
        duration: 3000
      });
    } 
       

    let respuesta: any = {};

    // Request para obtener al estudiante de acuerdo a su id de usuario
    this.service_datos.obtener_estudiante(this.id_usuario).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.estudiante = respuesta.body;

        // Request para obtener las practicas de acuerdo al id del estudiante
        this.service_datos.obtener_todos_config_practica().subscribe({
          next: (data: any) => {
            respuesta = { ...respuesta, ...data }
          }      ,
          error: (error: any) => console.log(error),
          complete: () => {
            this.config_practica = respuesta.body;
            console.log("Configuraciones de practica:",this.config_practica)
            // Guardar los distintos nombres de las practicas en un arreglo
            this.config_practica.forEach((element: any) => {
              if(!this.nombres_distintos_config_practica.includes(element.nombre)){
                this.nombres_distintos_config_practica.push(element.nombre)
                this.practicas_correspondiente_nombre.push([element.nombre])
              }
            });
            console.log("Nombres de configuraciones de practica:",this.nombres_distintos_config_practica)

            // Request para obtener todas las practicas de acuerdo al id del estudiante
            this.service_datos.obtener_practica(this.estudiante.id).subscribe({
              next: (data: any) => {
                respuesta = { ...respuesta, ...data }
              },
              error: (error: any) => console.log(error),
              complete: () => {
                this.practicas = respuesta.body;
                console.log("Practicas:",this.practicas)

                // Guardar nombres y practicas en un arreglo
                this.practicas.forEach((element: any) => {
                  this.flags_inscripcion_list.push(false);
                  // Para cada practica que el alumno tiene, encontrar el nombre de la configuracion de practica en el arreglo
                  // de nombres distintos y agregar la practica en el arreglo que se encarga de mantener la correspondencia entre nombre y practica
                  if(element.config_practica.nombre == this.nombres_distintos_config_practica.find((elemento: any) => elemento == element.config_practica.nombre)){
                    let index = this.nombres_distintos_config_practica.indexOf(element.config_practica.nombre);
                    element.documentos.map((doc:any) => {
                      doc.solicitud_documento.tipo_archivo = doc.solicitud_documento.tipo_archivo.split(",");
                      console.log("doc:",doc)
                      return doc;
                    });
                    //element.documento.solicitud_documento.tipo_archivo = element.documento.solicitud_documento.tipo_archivo.split(",");
                    this.practicas_correspondiente_nombre[index].push(element);                    
                  }
                });               
                console.log("Practicas correspondientes a nombre:",this.practicas_correspondiente_nombre)
              }
            });
          }
        });
      }
    });   
  }

  ingresarInforme(practica: any){
    let respuesta: any = {};
    let key = (document.getElementById("informe") as HTMLInputElement).value;
    let horas_trabajadas = (document.getElementById("horas") as HTMLInputElement).valueAsNumber;
    let id_config_informe = practica.config_practica.id;

    if (Number.isNaN(horas_trabajadas)){
      horas_trabajadas = 0;
    }

    if (key == "") {
      this._snackBar.open("Debe ingresar texto en la casilla de actividades","Cerrar",{
        panelClass: ['red-snackbar'],
        duration: 3000
      })
      return;
    }

    console.log("id_practica:", practica.id);
    console.log("casilla horas:", horas_trabajadas);
    
    this.service_datos.ingresar_informe(practica.id, key, id_config_informe, horas_trabajadas).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
        console.log("Respuesta ingresar informe:",data);
      },
      error: (error: any) => console.log("Error en ingresar informe:",error),
      complete: () => {
        this._snackBar.open("Informe Ingresado","Cerrar",{
          panelClass: ['red-snackbar'],
          duration: 3000
        })
        window.location.reload();
      }
    });
  }

  
  descargar_documento(documento_id: string, solicitud_tipo: string) {
    console.log("decargar documento")
    // abrir nueva pestaña con url de descarga, que es url_backend (sacada desde el env) + /documentos/ + documento_key
    if(solicitud_tipo == "documento"){
      window.open(environment.url_back+"/documento/download?id=" + documento_id, "_blank");
    } 
    else{
      window.open(environment.url_back+"/documento_extra/download?id=" + documento_id, "_blank");
    }
  }

  mostrar_informe(informes: any, informe_id: string) {
    console.log("informes:",informes,"id",informe_id)
    // abrir una ventana modal que muestre el texto del informe
    let informe = informes.find((informe: any) => informe.id == informe_id);
    if(informe){
      // abrir una ventana pequeña que muestre el texto del informe dentro de un textarea
      let ventana = window.open("", "_blank", "width=800,height=400");
      if (!ventana) {
        alert("Por favor, deshabilite el bloqueador de ventanas emergentes para este sitio");
      }
      else{
        ventana.document.write("<textarea style='width: 100%; height: 100%; resize: none; border: none;'>" + informe.key + "</textarea>");
      }
    }    
  }
  
  finalizar_practica(practica: any) {
    let resultado: any = {};
    console.log("practica",practica)

    this.service_gestion.finalizar_practica(this.estudiante.id, practica.id, environment.estado_practica.finalizada).subscribe({
      next: (data: any) => {
        console.log("Respuesta finalizar practica:",data);
      },
      error: (error: any) => console.log("Error en finalizar practica:",error),
      complete: () => {
        this._snackBar.open("Práctica Finalizada","Cerrar",{
          panelClass: ['red-snackbar'],
          duration: 3000
        })

        console.log("practica",practica, "estudiante",this.estudiante)
        this.service_supervisor.enviarLink(practica.supervisor.correo, practica.supervisor.nombre, this.estudiante.usuario.nombre).subscribe(
          {
            next: (data:any) => {
              resultado = { ...resultado, ...data };
            },
            error: (error:any) => {
              console.log("enviar mail error",error);

              this._snackBar.open("Se ha producido un error interno", "Cerrar", {
                panelClass: ['red-snackbar'],
                duration: 3000
              });
            },
            complete: () => {
              this._snackBar.open("Solicitud Ingresada Correctamente", "Cerrar", {
                panelClass:['red-snackbar'],
                duration:3000
              });
              console.log("Correo enviado");
              //reload page
              const newUrl = this.router.url + "?finalizacion_success=success";
              window.location.href = newUrl;
            }
          }
        );    

      }
    });
  }

  abrir_inscripcion(index: number) {
    // checkear si el estudiante ya tiene una práctica inscrita por cada practica en el arreglo practicas
    // si es así, no se puede inscribir a otra práctica
    let practicas_inscritas = this.practicas.filter((practica: any) => practica.estado == environment.estado_practica.en_curso);
    if (practicas_inscritas.length > 0) {
      this._snackBar.open("Error, ya tiene una práctica en curso.", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
      return;
    }
    else{
      this.flags_inscripcion_list[index] = true;
    }        
  }
}


