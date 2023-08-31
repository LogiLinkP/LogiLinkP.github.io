import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { DatePipe } from '@angular/common';

import * as dayjs from 'dayjs'
dayjs().format()
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

@Component({
  selector: 'app-barra-superior',
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.scss']
})
export class BarraSuperiorComponent implements OnInit{
  es_alumno: number = -1;
  tipo: string = "";
  id_usuario:number = 0;
  respuesta:any = [];
  nombre_usuario:string = "";

  personas:any=[];
  id_personas:any=[];

  id_persona:number = 0;
  estado_config:string = "";

  notificaciones: any = [];

  estados_configuracion = ["Notificaciones y Correo","Sólo Notificaciones", "Sólo Correo", "Ninguno"];

  constructor(private Service: DataUsuarioService,
              private service_noti: NotificacionesService,
              private cdr: ChangeDetectorRef,
              private datetime: DatePipe, private router: Router){
    // get user id from the local storage, in the key auth-user, userdata.id
    let auth_user = JSON.parse(localStorage.getItem("auth-user") || "{}");
    //console.log("Auth User:", auth_user);
    if (auth_user.userdata != undefined){
      let userdata = auth_user.userdata;
      console.log("Userdata:", userdata);
      if (userdata.id != undefined){
        this.id_usuario = userdata.id;
        this.nombre_usuario = userdata.nombre;
        this.estado_config = userdata.config;
      }
    }
   
    this.service_noti.callback.subscribe(res => {
      let fecha = this.datetime.transform((new Date), 'MM/dd/yyyy h:mm:ss')
      let mensaje = res.message;

      this.notificaciones.push({fecha: fecha, texto: mensaje, link: res.link});
      this.cdr.detectChanges();
    })
  }

  cambiar_configuracion_notificacion(Id:number, estado:string){
    this.service_noti.cambiar_configuración_notificaciones(Id, estado).subscribe({
      next:(data:any) => {
        this.respuesta = {...this.respuesta, ...data};
      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        console.log("Estado cambiado con éxito");
        this.respuesta = [];
      }
    })
  }

  obtener_personas(ID:number, IS:number){
    if (IS == 1){
      this.Service.obtener_encargados_practicas(ID).subscribe({
        next: (data:any) => {
          this.respuesta = {... this.respuesta, ...data}
        },
        error: (error:any) => {
          console.log(error);
          return;
        },
        complete: () => {
          if (this.respuesta.body[0].practicas.length == 0){
            return;
          }
          for (let i = 0; i < this.respuesta.body[0].practicas.length; i++){
            // check if the person is already in the list
            if (!this.id_personas.includes(this.respuesta.body[0].practicas[i].id_encargado)){
              this.id_personas.push(this.respuesta.body[0].practicas[i].id_encargado);
              this.personas.push(this.respuesta.body[0].practicas[i].encargado);
            }
          }
          this.respuesta = [];
          console.log("ENCARGADOS:",this.personas);
        }
      })
    }
    else{
      this.Service.obtener_estudiantes_practicas(ID).subscribe({
        next: (data:any) => {
          this.respuesta = {... this.respuesta, ...data}
        },
        error: (error:any) => {
          console.log(error);
          return;
        },
        complete: () => {
          if (this.respuesta.body[0].practicas.length == 0){
            return;
          }
          for (let i = 0; i < this.respuesta.body[0].practicas.length; i++){
            if (!this.id_personas.includes(this.respuesta.body[0].practicas[i].id_estudiante)){
              this.id_personas.push(this.respuesta.body[0].practicas[i].id_estudiante);
              this.personas.push(this.respuesta.body[0].practicas[i].estudiante);
            }
          }
          this.respuesta = [];
        }
      })
    } 
  }

  ngOnInit(): void {
    console.log(this.id_usuario);
    if(this.estado_config == "Correos y Notificaciones" || this.estado_config == "Sólo Notificaciones"){
      this.Service.obtener_notificaciones(this.id_usuario, this.estado_config).subscribe({
        next: (data:any) => {
          this.respuesta = { ...this.respuesta, ...data}
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          this.notificaciones = this.respuesta.body;
          this.notificaciones = this.notificaciones.map((notificacion:any ) => {
            notificacion.fecha = dayjs(notificacion.fecha, "YYYY-MM-DDTHH:mm:ssZ").format("DD/MM/YYYY HH:mm");
            return notificacion;
          });
          this.respuesta = [];
        }
      })
    }

    this.Service.obtener_usuario(this.id_usuario).subscribe({
      next: (data: any) => {
        this.respuesta = { ...this.respuesta, ...data }
      },
      error: (error: any) => {
        console.log(error);
        return;
      },
      complete: () => {
        if(this.respuesta.body.es_estudiante == true){
          this.es_alumno = 1;
          this.Service.obtener_estudiante(this.id_usuario).subscribe({
            next: (data:any) => {
              this.respuesta = { ...this.respuesta, ...data }
            },
            error: (error: any) =>{
              console.log(error);
              return;
            },
            complete:()=>{
              this.id_persona = this.respuesta.body.id;
              this.obtener_personas(this.id_persona, this.es_alumno);
            }
          })
        }
        else if(this.respuesta.body.es_encargado == true){
          this.es_alumno = 0;
          this.Service.obtener_encargado(this.id_usuario).subscribe({
            next: (data:any) => {
              this.respuesta = { ...this.respuesta, ...data }
            },
            error: (error: any) =>{
              console.log(error);
              return;
            },
            complete:()=>{
              this.id_persona = this.respuesta.body.id;
              this.obtener_personas(this.id_persona, this.es_alumno);
            }
          })
        }
        else{
          return;
        }
        this.respuesta = [];
      }
    });  
  }

  eliminar_notificaciones(id:number){
    this.service_noti.notificaciones_vistas(id).subscribe({
      next:(data:any) => {
        this.respuesta = {...this.respuesta, ...data};
      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        this.notificaciones = [];
        console.log("Notificaciones cambiadas");
        this.respuesta = [];
      }
    })
    this.notificaciones = [];
  }

  redirect_to_chat(userid_otro_participante:number, tipo:string){
    
    if(tipo=="encargado"){
      // reditect to url
      //window.location.href = "/chat/sala"+userid_otro_participante+this.id_usuario+"/"+this.id_usuario+"/"+userid_otro_participante+"/encargado"
      this.router.navigate(['/chat/sala'+userid_otro_participante+this.id_usuario+"/"+this.id_usuario+"/"+userid_otro_participante+"/encargado"]);
    }
    else if(tipo=="estudiante"){
      //window.location.href = "/chat/sala"+this.id_usuario+userid_otro_participante+"/"+this.id_usuario+"/"+userid_otro_participante+"/estudiante";
      this.router.navigate(['/chat/sala'+this.id_usuario+userid_otro_participante+"/"+this.id_usuario+"/"+userid_otro_participante+"/estudiante"]);
    }
  }


}
