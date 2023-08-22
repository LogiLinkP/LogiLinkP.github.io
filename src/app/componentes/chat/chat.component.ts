import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotisChatService } from 'src/app/servicios/notis-chat/notis-chat.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  Id: number = -1;
  Id2: number = -1;

  id_estudiante: number = -1;
  id_encargado: number = -1;

  tipo: String = "";

  Nmensaje:String="";
  Historial:any=[];

  alumno:any = [];

  respuesta:any = [];
  room: string="";

  constructor(private service: NotisChatService,
              private router: ActivatedRoute,
              private datetime: DatePipe,
              private cookie: CookieService) {
    this.router.params.subscribe(params => {this.Id = +params['id1'];});
    this.router.params.subscribe(params => {this.Id2 = +params['id2'];});
    this.router.params.subscribe(params => {this.tipo = params['tipo'];});   

    this.service.outEven.subscribe(res => {
      this.enviarmensaje();
    })
  }

  ngOnInit(): void{  
    this.router.params.subscribe(params => {this.room = params['room'];}); 
    this.cookie.set("room", this.room);

    if(this.tipo=="estudiante"){
      this.id_estudiante=this.Id;
      this.id_encargado=this.Id2;
    }
    else{
      this.id_encargado=this.Id;
      this.id_estudiante=this.Id2;
    }

    console.log("Id estudiante: ", this.id_estudiante);
    console.log("Id encargado: ", this.id_encargado);

    // buscar si chat existe en BD
    this.service.getchat(this.id_estudiante,this.id_encargado).subscribe({
      next: (data: any) => {
        this.respuesta = { ...this.respuesta, ...data }
      },
      error: (error: any) => {
        console.log(error);
        return;
      },
      complete: () => {
        this.Historial = JSON.parse(this.respuesta.body);
        console.log("CHAT RECIBIDO: ",this.Historial);
        if(this.Historial==null){
          console.log("Chat no encontrado, creando");
          this.service.postchat(this.id_estudiante, this.id_encargado).subscribe({
            next: (data: any) => {
              this.respuesta = { ...this.respuesta, ...data }
              console.log("Request aceptada");
            },
            error: (error: any) => console.log("Error en post chat:",error),
            complete: () => {
              console.log("Chat creado");
              console.log(this.respuesta);
            }
          });
        }   
      }
    });     
  }  

  enviarmensaje(){
    let mensaje = {
      emisor: this.tipo,
      texto: this.Nmensaje,
      fecha: this.datetime.transform((new Date), 'MM/dd/yyyy h:mm:ss'),
    }      
    this.service.postmensaje(this.id_estudiante, this.id_encargado, mensaje).subscribe({
      next: (data: any) => {
        this.respuesta = { ...this.respuesta, ...data }
        console.log("Request aceptada");
      },
      error: (error: any) => console.log("Error en enviar mensaje:",error),  
      complete: () => {
        console.log("Mensaje Enviado");
        console.log(this.respuesta);
        this.service.emitEvent(mensaje);
        console.log("MENSAJEEE",mensaje)
        this.Historial.push(mensaje);
        this.Nmensaje="";        
      }
    });
  };  
  
}
