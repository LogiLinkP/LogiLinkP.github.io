import { Component, OnInit, Input, Inject } from '@angular/core';
import { GestionarService } from '../../servicios/alumno/gestionar_practica.service';
import { ObtenerDatosService } from '../../servicios/alumno/obtener_datos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { EmpresaService } from '../../servicios/empresa/empresa.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormControl } from '@angular/forms';

export interface DialogData {
  nombre_solicitud: string;
  descripcion: string;
  tipo_archivo: string[];
}
@Component({
  selector: 'app-iniciar-practica',
  templateUrl: './iniciar-practica.component.html',
  styleUrls: ['./iniciar-practica.component.scss']
})

export class IniciarPracticaComponent implements OnInit {
  @Input() id_estudiante = -1
  @Input() nombre_practica: string = ""
  @Input() id_usuario = -1
  id_config_practica = -1
  config_practica: any = []
  cantidades: number[] = []
  modalidades: any = []
  fecha_hoy = new FormControl(new Date());

  @Input() estado_config: string = ""

  correo_encargado: string = "";

  respuesta: any = [];
  empresas: any = [];
  id_datalist: string;
  empresa_agregada: boolean = false;
  auth_user = JSON.parse(localStorage.getItem("auth-user") || "{}");

  constructor(private service: GestionarService, private service2: ObtenerDatosService,
    private _snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router,
    private service_noti: NotificacionesService, private service_obtener: DataUsuarioService,
    private datetime: DatePipe, private empresaService: EmpresaService, public dialog: MatDialog,) {
    let data: any = {};
    empresaService.get_empresas().subscribe({
      next: (_data: any) => {
        data = { ...data, ..._data };
      },
      error: (error: any) => {
        this.empresas = [];
      },
      complete: () => {
        if (data.status != 200) {
          this._snackBar.open("Se ha producido un error, por favor vuelva más tarde", "Cerrar", {
            panelClass: ['red-snackbar'],
            duration: 3000
          });
          return;
        }
        this.empresas = data.body;
      }
    });
  }

  enviar() {

    //validar que el rut ingresado sea del datalist
    let rut_empresa_elegida = (document.getElementById(this.id_datalist + "_input") as HTMLInputElement).value;
    let opciones_ruts_empresas = (document.getElementById(this.id_datalist) as HTMLDataListElement).options;
    let empresa_valida = Object.values(opciones_ruts_empresas).map((element: any) => element.value).includes(rut_empresa_elegida)
    if (!empresa_valida) {
      this._snackBar.open("Debe seleccionar una empresa válida", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
      return;
    }
    // obtener los datos de los inputs
    let modalidad = (document.getElementById("modalidad" + this.nombre_practica) as HTMLInputElement).value
    let cantidad = (document.getElementById("cantidad" + this.nombre_practica) as HTMLInputElement).value

    let nombre_supervisor = (document.getElementById("nombre_supervisor" + this.nombre_practica) as HTMLInputElement).value
    let correo_supervisor = (document.getElementById("correo_supervisor" + this.nombre_practica) as HTMLInputElement).value
    let rut_empresa = (document.getElementById(this.id_datalist + '_input') as HTMLInputElement).value
    let fecha_inicio = (document.getElementById("fecha_inicio" + this.nombre_practica) as HTMLInputElement).value

    //convertir fecha_inicio a formato yyyy-mm-dd para que sea compatible con la base de datos
    let fecha_inicio_array = fecha_inicio.split("/")
    fecha_inicio = fecha_inicio_array[2] + "-" + fecha_inicio_array[1] + "-" + fecha_inicio_array[0]

    let aux: any = {}

    if (modalidad == "" || cantidad == "" || nombre_supervisor == "" || correo_supervisor == "" || rut_empresa == "" || fecha_inicio == "") {
      this._snackBar.open("Debe llenar todos los campos", "Cerrar", {
        panelClass: ['red-snackbar'],
        duration: 3000
      });
      return
    }

    this.service2.obtener_config_practica(this.nombre_practica, this.auth_user.userdata.estudiante.id_carrera).subscribe({
      next: (data: any) => {
        aux = { ...aux, ...data }
      },
      error: (error: any) => { },
      complete: () => {
        this.id_config_practica = aux.body.id

        this.service.buscar_modalidad(this.id_config_practica, modalidad, parseInt(cantidad)).subscribe({
          next: (data: any) => {
            aux = { ...aux, ...data }
          },
          error: (error: any) => { },
          complete: () => {
            let id_modalidad = aux.body.id

            // INICIO DE CREACION DE EMPRESA, SUPERVISOR Y PRACTICA
            this.service.get_empresa_por_rut(rut_empresa).subscribe({
              next: (data: any) => {
                aux = { ...aux, ...data }
              },
              error: (error: any) => { },
              complete: () => {
                // parse de body as json
                let id_empresa = aux.body.id
                this.service.registrar_supervisor(nombre_supervisor, correo_supervisor).subscribe({
                  next: (data: any) => {
                    aux = { ...aux, ...data }
                  },
                  error: (error: any) => { },
                  complete: () => {
                    let id_supervisor = aux.body.id

                    this.service.buscar_encargados().subscribe({
                      next: (data: any) => {
                        aux = { ...aux, ...data }
                      },
                      error: (error: any) => { },
                      complete: () => {
                        //seleccionar el primer encargado
                        let id_encargado = aux.body.data[0].id
                        this.service_obtener.obtener_encargado(aux.body.data[0].id_usuario).subscribe({
                          next: (data: any) => {
                            this.respuesta = { ...this.respuesta, ...data };
                          },
                          error: (error: any) => {
                            return;
                          },
                          complete: () => {
                            this.correo_encargado = this.respuesta.body.correo;
                          }
                        })

                        this.service.registrar_practica(this.id_estudiante, id_modalidad, fecha_inicio,
                          id_empresa, id_supervisor, id_encargado, +this.id_config_practica).subscribe({
                            next: (data: any) => {
                              aux = { ...aux, ...data }
                            },
                            error: (error: any) => {
                              // use snackbar to show error
                              this._snackBar.open("Error al iniciar practica", "Cerrar", {
                                panelClass: ['red-snackbar'],
                                duration: 3000
                              });
                            },
                            complete: () => {
                              let texto: string = "El estudiante " + this.id_estudiante + " ha comenzado una nueva práctica";
                              let enlace = environment.url_front + "/practicas/" + this.id_estudiante;
                              this.service_noti.postnotificacion(this.id_usuario, texto, this.correo_encargado, this.estado_config, enlace).subscribe({

                                next: (data: any) => {
                                  this.respuesta = { ...this.respuesta, ...data };
                                },
                                error: (error: any) => {
                                  return;
                                },
                                complete: () => {
                                }
                              });
                              let inscripcion_string = "";
                              if (aux.status == 200) {
                                inscripcion_string = "?inscripcion_success=success";
                              } else {
                                inscripcion_string = "?inscripcion_success=error";
                              }
                              let newUrl = this.router.url.split("?")[0];
                              newUrl += inscripcion_string;
                              window.location.href = newUrl;
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    // Crear empresa, supervisor y practica
  }

  manage_dialog_return(result: Array<any>) {
    switch (result[0]) {
      case "error":
        this._snackBar.open("Se ha producido un error, por favor vuelva más tarde", "Cerrar", {
          panelClass: ['red-snackbar'],
          duration: 3000
        });
        break;
      case "Empresa ya existe":
        this._snackBar.open("Esta empresa ya está registrada, ingrésala normalmente", "Cerrar", {
          panelClass: ['green-snackbar'],
          duration: 3000
        });
        break;
      case "Empresa agregada":
        this._snackBar.open("Empresa agregada correctamente", "Cerrar", {
          panelClass: ['green-snackbar'],
          duration: 3000
        });
        this.modificar_lista_empresas(result[1]);
        this.add_default_empresa(result[1]);
        this.empresa_agregada = true;
        break;
      default:
        break;
    }
  }

  modificar_lista_empresas(nueva_empresa: any) {
    let aux = [{
      nombre_empresa: nueva_empresa.nombre_empresa,
      rut_empresa: nueva_empresa.rut_empresa
    }];
    aux.push(...this.empresas);
    this.empresas = aux;
  }

  add_default_empresa(nueva_empresa: any) {
    // change value of input
    (document.getElementById(this.id_datalist + "_input") as HTMLInputElement).value = nueva_empresa.rut_empresa;

  }

  agregar_empresa() {
    let nombre_solicitud = "";
    let descripcion = "";
    let tipo_archivo = "";
    const dialogRef = this.dialog.open(Dialog, {
      width: '300px',
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
      data: { nombre_solicitud, descripcion, tipo_archivo }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.manage_dialog_return(result);
    });
  }

  ngOnInit() {
    this.id_datalist = 'rut_empresa_' + this.nombre_practica.replaceAll(" ", "_");
    let respuesta: any = {};

    this.service2.obtener_config_practica(this.nombre_practica, this.auth_user.userdata.estudiante.id_carrera).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => { },
      complete: () => {
        this.config_practica = respuesta.body

        let modalidades_nombres: string[] = []

        // iterar sobre config_practica y llenar el array de modalidades con config_practica.modalidad
        this.config_practica.modalidads.forEach((element: any) => {
          this.modalidades.push(element)
          if (!modalidades_nombres.includes(element.tipo_modalidad)) {
            modalidades_nombres.push(element.tipo_modalidad)
          }
        });

        // hacer que el dropdown de modalidad se actualice al obtener la respuesta dela query
        var dropdown = document.getElementById("modalidad" + this.nombre_practica)

        // actualizar el dropdown de modalidad con el contenido de this.modalidades
        for (let i = 0; i < modalidades_nombres.length; i++) {
          var option = document.createElement("option")
          option.text = modalidades_nombres[i]
          option.value = modalidades_nombres[i]
          dropdown?.appendChild(option)
        }

      }
    });
  }

  actualizar_cantidades(modalidad: any) {
    // actualizar el dropdown de cantidad segun la modalidad seleccionada

    // borrar el contenido del dropdown de cantidad
    var dropdown_cantidad = document.getElementById("cantidad" + this.nombre_practica)
    while (dropdown_cantidad?.firstChild) {
      dropdown_cantidad.removeChild(dropdown_cantidad.firstChild);
    }
    this.cantidades = []

    this.modalidades.forEach((element: any) => {
      if (element.tipo_modalidad == modalidad.target.value) {
        if (!this.cantidades.includes(element.cantidad_tiempo)) {
          this.cantidades.push(element.cantidad_tiempo)
        }
      }
    });

    var dropdown_cantidad = document.getElementById("cantidad" + this.nombre_practica)

    // actualizar el dropdown de cantidad con el contenido de this.cantidades
    if (this.cantidades.length > 0) {
      if (this.cantidades[0] != null) {
        for (let i = 0; i < this.cantidades.length; i++) {
          //chequear si cantidades[i] es un numero
          if (isNaN(this.cantidades[i])) {
            continue
          }
          var option = document.createElement("option")
          option.text = this.cantidades[i].toString()
          option.value = this.cantidades[i].toString()
          dropdown_cantidad?.appendChild(option)
        }
      }
    }
  }

}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule, CommonModule, NgIf,
    MatCardModule],
})
export class Dialog {
  modo_auto: boolean = true;
  enviar_habilitado_auto: boolean = false;
  enviar_habilitado_manual: boolean = false;
  default_rut: string = "";

  constructor(public dialogRef: MatDialogRef<Dialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private empresaService: EmpresaService,
    private _snackBar: MatSnackBar) { }

  onNoClick(): void {
    this.dialogRef.close(["cerrar", false]);
  }

  habilitar_envio_auto(event: any) {
    this.enviar_habilitado_auto = event.target.value.trim() != "";
  }

  habilitar_envio_manual(event: any) {
    const campo_nom = (document.getElementById("nombre_empresa_manual") as HTMLInputElement).value.trim();
    const campo_rut = (document.getElementById("rut_empresa_manual") as HTMLInputElement).value.trim();
    this.enviar_habilitado_manual = campo_nom != "" && campo_rut != "";
  }

  agregar_empresa_auto() {
    const rut_empresa = document.getElementById("rut_empresa_auto") as HTMLInputElement;
    let data: any = {};
    this.empresaService.agregar_empresa_auto(rut_empresa.value).subscribe({
      next: (_data: any) => {
        data = { ...data, ..._data };
      }, error: (error: any) => {
        if (error.status == 400 && error.error.message == "Empresa ya existe") {
          this.dialogRef.close(["Empresa ya existe", false]);
          return;
        }
        this.dialogRef.close(["error", false]);
      }, complete: () => {
        if (data.status == 200) {
          if (data.body.message == "Empresa agregada") {
            this.dialogRef.close(["Empresa agregada", data.body]);
            return;
          } else if (data.body.message == "Empresa no encontrada") {
            this.default_rut = rut_empresa.value;
            this.modo_auto = false;
            return;
          } else {
            this.dialogRef.close(["error", false]);
            return;
          }
        }
        this.dialogRef.close(["error", false]);
      }
    });
  }

  completar_rut(evento: any) {
    let rut_escrito = evento.target.value;
    if (!rut_escrito || rut_escrito.length < 1) {
      evento.target.value = "";
      return;
    }
    let rut = rut_escrito.replace(/[^0-9kK]+/g, '');
    if (!rut || rut.length < 1) {
      evento.target.value = "";
      return;
    }
    let rut_splitted = rut.split("");
    let rut_parsed = rut_splitted.pop() + "-";
    let contador = 0;
    while (rut_splitted.length > 0) {
      rut_parsed += rut_splitted.pop();
      contador++;
      if (contador == 3 && rut_splitted.length > 0) {
        rut_parsed += ".";
        contador = 0;
      }
    }
    evento.target.value = rut_parsed.split("").reverse().join("");
  }

  agregar_empresa_manual() {
    const rut_empresa = (document.getElementById("rut_empresa_manual") as HTMLInputElement).value.trim();
    const nombre_empresa = (document.getElementById("nombre_empresa_manual") as HTMLInputElement).value.trim();

    let data: any = {};
    this.empresaService.agregar_empresa_manual(nombre_empresa, rut_empresa).subscribe({
      next: (_data: any) => {
        data = { ...data, ..._data };
      }, error: (error: any) => {
        console.log(error)
        this.dialogRef.close(["error", false]);
        return;
      }, complete: () => {
        console.log("on complete, data:", data);
        if (data.status == 200 && data.body.message == "Empresa agregada") {
          this.dialogRef.close(["Empresa agregada", data.body]);
          return;
        }
        this.dialogRef.close(["error", false]);
      }
    });
  }
}