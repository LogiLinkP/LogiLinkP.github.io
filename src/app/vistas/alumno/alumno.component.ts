import { Component, OnInit} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { GestionarService } from 'src/app/servicios/alumno/gestionar_practica.service';
import { SupervisorService } from 'src/app/servicios/supervisor/supervisor.service';
import { Router } from "@angular/router"
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';

@Component({
  selector: 'alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss']
})
export class DetalleAlumnoComponent implements OnInit{
  usuario: any = {} 
  estudiante: any = {} 
  config_practicas: any = [];
  practicas: any = [];
  solicitudes_practicas: any = [];

  estado_config:string = "";

  nombres_config_practica: string[] = [];
  practicas_correspondiente_nombre: any = [];
  
  flags_inscripcion_list: boolean[] = [];
  link_finalizacion = ""
  link_inscripcion = ""
  doc_str = "documento";
  doc_extra_str = "documento_extra";

  constructor(private service_datos: ObtenerDatosService , private activated_route: ActivatedRoute, private _snackBar: MatSnackBar, 
              private service_gestion: GestionarService, private service_supervisor: SupervisorService, private router: Router,
              private service_noti: NotificacionesService, private service_obtener: DataUsuarioService) {
    this.usuario = JSON.parse(localStorage.getItem('auth-user') || '{}').userdata;
    this.estudiante = this.usuario.estudiante;
    this.estado_config = this.usuario.body;

    //console.log("usuario:",this.usuario);
    //console.log("estudiante:",this.estudiante);
  }

  ngOnInit() {
    const param_upload_success = this.activated_route.snapshot.queryParamMap.get('upload_success');

    let snackBarRef: MatSnackBarRef<any> | undefined = undefined;

    //console.log("PARAMETRO URL",param_upload_success);
    if (param_upload_success == "success") {
      snackBarRef = this._snackBar.open("Archivo subido correctamente", "Cerrar", {
        panelClass: ['green-snackbar'],
        duration: 3000
      });
    } else if (param_upload_success == "format") {
      snackBarRef = this._snackBar.open("Archivo con formato incorrecto", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
    } else if (param_upload_success == "error") {
      snackBarRef = this._snackBar.open("Error al subir archivo", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
    }

    const param_inscripcion_success = this.activated_route.snapshot.queryParamMap.get('inscripcion_success');
    if (param_inscripcion_success == "success") {
      snackBarRef = this._snackBar.open("Práctica inscrita correctamente", "Cerrar", {
        panelClass: ['green-snackbar'],
        duration: 3000
      });
    } else if (param_inscripcion_success == "error") {
      snackBarRef = this._snackBar.open("Error al inscribir práctica", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
    }
    
    const param_finalizacion_success = this.activated_route.snapshot.queryParamMap.get('finalizacion_success');
    if (param_finalizacion_success == "success") {
      snackBarRef = this._snackBar.open("Práctica finalizada correctamente", "Cerrar", {
        panelClass: ['green-snackbar'],
        duration: 3000
      });
    }        

    let respuesta: any = {};


    // Request para obtener todas las config practicas
    this.service_datos.obtener_todos_config_practica().subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      }      ,
      error: (error: any) => console.log(error),
      complete: () => {
        this.config_practicas = respuesta.body;
        //console.log("Configuraciones de practica:",this.config_practicas)

        // Guardar nombres de las configuraciones de practica en un arreglo
        this.config_practicas.forEach((element: any) => {
          // verificar que el nombre no este en el arreglo
          if(!this.nombres_config_practica.includes(element.nombre)){
            this.nombres_config_practica.push(element.nombre);
            this.practicas_correspondiente_nombre.push([element.nombre]);
          }
        });
        //console.log("Nombres de configuraciones de practica:",this.nombres_config_practica)

        // Request para obtener todas las practicas de acuerdo al id del estudiante
        this.service_datos.obtener_practica(this.estudiante.id).subscribe({
          next: (data: any) => {
            respuesta = { ...respuesta, ...data }
          },
          error: (error: any) => console.log(error),
          complete: () => {
            this.practicas = respuesta.body;
            //console.log("Practicas:",this.practicas)

            // Guardar nombres y practicas en un arreglo
            this.practicas.forEach((element: any) => {
              this.flags_inscripcion_list.push(false);
              // Para cada practica que el alumno tiene, encontrar el nombre de la configuracion de practica en el arreglo
              // de nombres y agregar la practica en el arreglo que se encarga de mantener la correspondencia entre nombre y practica
              if(element.modalidad.config_practica.nombre == this.nombres_config_practica.find((elemento: any) => elemento == element.modalidad.config_practica.nombre)){
                let index = this.nombres_config_practica.indexOf(element.modalidad.config_practica.nombre);
                element.documentos.map((doc:any) => {
                  doc.solicitud_documento.tipo_archivo = doc.solicitud_documento.tipo_archivo.split(",");
                  //console.log("doc:",doc)
                  return doc;
                });
                //element.documento.solicitud_documento.tipo_archivo = element.documento.solicitud_documento.tipo_archivo.split(",");
                this.practicas_correspondiente_nombre[index].push(element);                    
              }
              // make a request to get all solicitudes_documentos for the current practica, using /todos_docs_practica
              this.service_datos.obtener_solicitudes_documentos_practica(element.modalidad.config_practica.id, element.id).subscribe({
                next: (data: any) => {
                  respuesta = { ...respuesta, ...data }
                },
                error: (error: any) => console.log(error),
                complete: () => {
                  this.solicitudes_practicas.push(respuesta.body);
                  //console.log("Solicitudes de documentos de la practica:",this.solicitudes_practicas)
                }
              });
            });               
            //console.log("Practicas correspondientes a nombre:",this.practicas_correspondiente_nombre)
          }
        });
      }
    });  
  }

  
  ingresarInforme(practica: any){
    let respuesta: any = {};
    let texto_informe = (document.getElementById("informe") as HTMLInputElement).value;
    let horas_trabajadas = (document.getElementById("horas") as HTMLInputElement).valueAsNumber;
    let id_config_informe = practica.modalidad.config_practica.config_informes[0].id; // AGARRA EL PRIMER CONFIG INFORME QUE ENCUENTRE
    let id_encargado = practica.encargado.id;

    let key = JSON.stringify({[practica.modalidad.config_practica.config_informes[0].
                              pregunta_informes[0].id]: texto_informe}); //AGARRA LA PRIMERA PREGUNTA DEL CONFIG INFORME QUE ENCUENTRE Y LE ASIGNA EL TEXTO DEL INFORME
    
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

    //console.log("id_practica:", practica.id);
    //console.log("casilla horas:", horas_trabajadas);
    
    this.service_datos.ingresar_informe(practica.id, key, id_config_informe, horas_trabajadas, id_encargado).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
        //console.log("Respuesta ingresar informe:",data);
      },
      error: (error: any) => console.log("Error en ingresar informe:",error),
      complete: () => {
        /*
        let id_encargado_usuario = practica.encargado.id_usuario;
        let correo_encargado: string = "";
        this.service_noti.postnotificacion(id_encargado_usuario, "El alumno "+ this.estudiante.nombre + " ha ingresado un informe diario", correo_encargado).subscribe({
          next:(data:any) => {
            respuesta = {...respuesta, ...data};
          },
          error:(error:any) =>{
            console.log(error);
          },
          complete:()=>{
            console.log("Notificacion enviada con éxito");
          }
        })*/
        this._snackBar.open("Informe Ingresado","Cerrar",{
          panelClass: ['red-snackbar'],
          duration: 3000
        })
        window.location.reload();        
      }
    });
  }

  
  descargar_documento(documento_id: string, solicitud_tipo: string) {
    //console.log("decargar documento")
    // abrir nueva pestaña con url de descarga, que es url_backend (sacada desde el env) + /documentos/ + documento_key
    if(solicitud_tipo == "documento"){
      window.open(environment.url_back+"/documento/download?id=" + documento_id, "_blank");
    } 
    else{
      window.open(environment.url_back+"/documento_extra/download?id=" + documento_id, "_blank");
    }
  }

  mostrar_informe(informes: any, informe_id: string) {
    //console.log("informes:",informes,"id",informe_id)
    // abrir una ventana modal que muestre el texto del informe
    let informe = informes.find((informe: any) => informe.id == informe_id);
    if(informe){
      // abrir una ventana pequeña que muestre el texto del informe dentro de un textarea
      let ventana = window.open("", "_blank", "width=800,height=400");
      if (!ventana) {
        alert("Por favor, deshabilite el bloqueador de ventanas emergentes para este sitio");
      }
      else{
        let respuestas = informe.key
        // obtener las llaves del json donde estan las respuestas a las preguntas
        let keys = Object.keys(respuestas);
        let texto_informe = respuestas[keys[0]]; // AGARRA EL TEXTO DE LA PRIMERA RESPUESTA 
        //console.log("texto_informe:",texto_informe);
        ventana.document.write("<textarea style='width: 100%; height: 100%; resize: none; border: none;'>" + texto_informe + "</textarea>");
      }
    }    
  }
  
  finalizar_practica(practica: any) {
    let respuesta: any = [];
    let id_encargado = practica.encargado.id_usuario;
    let correo_encargado: string = "";

    //console.log("Así se ve la configuración de estados");
    //console.log(respuesta.body.config);
    correo_encargado = practica.encargado.usuario.correo;
    //console.log("correo_encargado:",correo_encargado);

    let correo_supervisor: string = practica.supervisor.correo;

    //console.log("practica",practica)
    let nom_estudiante: string = this.usuario.nombre;

    this.service_gestion.finalizar_practica(practica.id_estudiante, practica.id, environment.estado_practica.finalizada, correo_supervisor, nom_estudiante).subscribe({
      next: (data: any) => {
        //console.log("Respuesta finalizar practica:",data);
      },
      error: (error: any) => console.log("Error en finalizar practica:",error),
      complete: () => {
        let respuesta: any = [];
        let enlace: string = environment.url_front + "/alumno/" + this.usuario.id;
        this.service_noti.postnotificacion(id_encargado, "El alumno " + this.estudiante.nombre + " ha finalizado su práctica y desea su realización", correo_encargado, this.estado_config, enlace).subscribe({
          next:(data:any) => {
            respuesta = {...respuesta, ...data};
          },
          error:(error:any) => {
            //console.log(error);
            return;
          },
          complete:() => {
            //console.log("Notificación enviada con éxito");
          }
        });
        this._snackBar.open("Práctica Finalizada","Cerrar",{
          panelClass: ['red-snackbar'],
          duration: 3000
        })
        // after 3 seconds reload the page
        setTimeout(() => {
          //window.location.reload();
          window.location.href = environment.url_front + "/encuestaFinal/" + practica.id;
        }
        , 3000);

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

  redirigir_a_ingreso_informe(id_informe: any) {
    // redirigir a la página de ingreso de informe
    this.router.navigate(['/ingreso-informe'], { queryParams: { id_informe: id_informe } });
  }
}


