import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { CookieService } from 'ngx-cookie-service';

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

  Yo:any=[];
  personas:any=[];
  id_personas:any=[];

  id_persona:number = 0;

  notificaciones: any = [];

  constructor(private Service: DataUsuarioService,
              private router: ActivatedRoute,
              private cookie: CookieService,
              private noti: NotificacionesService,
              private cdr: ChangeDetectorRef){
    // get user id from the local storage, in the key auth-user, userdata.id
    let auth_user = JSON.parse(localStorage.getItem("auth-user") || "{}");
    console.log("Auth User:", auth_user);
    if (auth_user.userdata != undefined){
      let userdata = auth_user.userdata;
      console.log("Userdata:", userdata);
      if (userdata.id != undefined){
        this.id_usuario = userdata.id;
      }
    }
    
    this.noti.callback.subscribe(res => {
      const {fecha, mensaje} = res;
      console.log("mira esta notificacion " + mensaje);
      this.notificaciones.push(res);
      this.cdr.detectChanges();
      console.log("Mira estas notificaciones"+ this.notificaciones);
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
        }
      })
    } 
  }

  ngOnInit(): void {

    this.Service.obtener_notificaciones(this.id_usuario).subscribe({
      next: (data:any) => {
        this.respuesta = { ...this.respuesta, ...data}
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.log("Antes de pushear " + JSON.parse(this.respuesta.body));
        this.notificaciones = this.respuesta[0];
        console.log("Hola, estas son las notificaciones iniciales " + this.notificaciones);
      }
    })

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
      }
    });  
  }

  eliminar_notificaciones(id:number){
    this.noti.notificaciones_vistas(id).subscribe({
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
      }
    })
    this.notificaciones = [];
  }

  redirect_to_chat(id_otro_participante:number, userid_otro_participante:number, tipo:string){
    
    if(tipo=="encargado"){
      // reditect to url
      window.location.href = "/chat/sala"+id_otro_participante+this.id_persona+"/"+this.id_persona+"/"+id_otro_participante+"/encargado?userid_otro_participante="+userid_otro_participante
    }
    else if(tipo=="estudiante"){
      window.location.href = "/chat/sala"+this.id_persona+id_otro_participante+"/"+this.id_persona+"/"+id_otro_participante+"/estudiante?userid_otro_participante="+userid_otro_participante
    }
  }


}
