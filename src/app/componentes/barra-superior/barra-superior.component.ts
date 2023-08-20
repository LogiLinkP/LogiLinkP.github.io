import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';
import { CookieService } from 'ngx-cookie-service';
import { NotisChatService } from 'src/app/servicios/notis-chat/notis-chat.service';

@Component({
  selector: 'app-barra-superior',
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.scss']
})
export class BarraSuperiorComponent implements OnInit{
  es_alumno: number = -1;
  tipo: string = "";
  Id:number = 0;
  respuesta:any = [];

  Yo:any=[];
  personas:any=[];
  id_personas:any=[];

  id1:number = 0;

  notificaciones: any = [];

  constructor(private Service: DataUsuarioService,
              private router: ActivatedRoute,
              private cookie: CookieService,
              private noti: NotisChatService){
    this.router.params.subscribe(params => {this.Id = +params['id'];});
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
          if (this.respuesta.body.practicas.length == 0){
            return;
          }
          for (let i = 0; i < this.respuesta.body.practicas.length; i++){
            if (!this.id_personas.includes(this.respuesta.body[0].practicas[i].id_estudiante)){
              this.id_personas.push(this.respuesta.body.practicas[i].id_estudiante);
              this.personas.push(this.respuesta.body.practicas[i].estudiante);
            }
          }
        }
      })
    } 
  }

  ngOnInit(): void {
    this.cookie.set("notificaciones", this.Id.toString());

    this.Service.obtener_notificaciones(this.Id).subscribe({
      next: (data:any) => {
        this.respuesta = { ...this.respuesta, ...data}
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        this.notificaciones = this.respuesta.body;
      }
    })

    this.Service.obtener_usuario(this.Id).subscribe({
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
          this.Service.obtener_estudiante(this.Id).subscribe({
            next: (data:any) => {
              this.respuesta = { ...this.respuesta, ...data }
            },
            error: (error: any) =>{
              console.log(error);
              return;
            },
            complete:()=>{
              this.id1 = this.respuesta.body.id;
              this.obtener_personas(this.id1, this.es_alumno);
            }
          })
        }
        else if(this.respuesta.body.es_encargado == true){
          this.es_alumno = 0;
          this.Service.obtener_encargado(this.Id).subscribe({
            next: (data:any) => {
              this.respuesta = { ...this.respuesta, ...data }
            },
            error: (error: any) =>{
              console.log(error);
              return;
            },
            complete:()=>{
              this.id1 = this.respuesta.body.id;
              this.obtener_personas(this.id1, this.es_alumno);
            }
          })
        }
        else{
          return;
        }
      }
    });  
  }
}
