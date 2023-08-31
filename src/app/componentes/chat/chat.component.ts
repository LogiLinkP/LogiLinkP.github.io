import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotisChatService } from 'src/app/servicios/notis-chat/notis-chat.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { NotificacionesService } from 'src/app/servicios/notificaciones/notificaciones.service';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChatComponent implements OnInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef; //para scrollear al final
  @ViewChild('sendButton') sendButton!: ElementRef; //para poder apretar el boton sin salirse del textarea

  Id: number = -1;
  Id2: number = -1;

  id_estudiante: number = -1;
  id_encargado: number = -1;
  id_usuario: number = -1;
  userid_otro_participante: number = -1;

  nombre_estudiante: string = "";
  nombre_encargado: string = "";

  tipo: String = "";

  Nmensaje:String="";
  Historial:any=[];

  usuario_otro_participante: any = [];

  respuesta:any = [];
  room: string="";

  chatService: any;

  estado_config_estudiante: string = "";
  estado_config_encargado: string = "";

  correo_estudiante: string = "";
  correo_encargado: string = "";

  constructor(private _http: HttpClient, private router: ActivatedRoute, private datetime: DatePipe,
              private cookieService: CookieService, private cdr: ChangeDetectorRef,
              private service_noti: NotificacionesService, private service_obtener : DataUsuarioService) {

    let auth_user = JSON.parse(localStorage.getItem("auth-user") || "{}");


    this.router.params.subscribe(params => {this.Id = +params['id1'];});
    this.router.params.subscribe(params => {this.Id2 = +params['id2'];});
    this.id_usuario = auth_user.userdata.id;
    this.router.params.subscribe(params => {this.tipo = params['tipo'];});

    let id_aux = this.router.snapshot.queryParamMap.get('userid_otro_participante');
    if(id_aux!=null){
      this.userid_otro_participante = +id_aux;
    }

    this.router.params.subscribe(params => {this.room = params['room'];}); 

    // check if the room is already set in the cookies, if it is destroy it
    if(this.cookieService.check("room")){
      //console.log("Destruyendo cookie room", this.cookieService.get("room"));
      this.cookieService.delete("room");
    }
    this.cookieService.set("room", this.room);
    //console.log("Room seteada en cookies:", this.room);    
  }

  ngOnInit(): void{
    this.chatService = new NotisChatService(this._http, this.cookieService);

    this.chatService.outEven.subscribe((res:any) => {
      this.enviarmensaje();
    })    

    if(this.tipo=="estudiante"){
      this.id_estudiante=this.Id;
      this.id_encargado=this.Id2;
    }
    else{
      this.id_encargado=this.Id;
      this.id_estudiante=this.Id2;
    }

    this.service_obtener.obtener_estudiante(this.id_estudiante).subscribe({
      next:(data:any) => {
        this.respuesta = {...this.respuesta, ...data};
      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        console.log(this.respuesta.body);
        this.nombre_estudiante = this.respuesta.body.usuario.nombre;
        this.correo_estudiante = this.respuesta.body.usuario.correo;
      }
    })

    this.service_obtener.obtener_encargado(this.id_encargado).subscribe({
      next:(data:any) => {
        this.respuesta = {... this.respuesta, ...data};
      },
      error:(error:any) => {
        console.log(error);
        return;
      },
      complete:() => {
        console.log(this.respuesta.body);
        this.nombre_encargado = this.respuesta.body.usuario.nombre
        this.correo_encargado = this.respuesta.body.usuario.correo;
      }
    })

    // buscar si chat existe en BD
    this.chatService.getchat(this.id_estudiante,this.id_encargado).subscribe({
      next: (data: any) => {
        this.respuesta = { ...this.respuesta, ...data }
      },
      error: (error: any) => {
        //console.log(error);
        return;
      },
      complete: () => {
        this.Historial = JSON.parse(this.respuesta.body);
        //console.log("CHAT RECIBIDO: ",this.Historial);
        if(this.Historial==null){
          //console.log("Chat no encontrado, creando");
          this.chatService.postchat(this.id_estudiante, this.id_encargado).subscribe({
            next: (data: any) => {
              this.respuesta = { ...this.respuesta, ...data }
              //console.log("Request aceptada");
            },
            error: (error: any) => console.log("Error en post chat:",error),
            complete: () => {
              //console.log("Chat creado");
              //console.log(this.respuesta);
              this.cdr.detectChanges();  
              this.chatService.event$.subscribe( (res:any) => {                
                this.cdr.detectChanges(); 
              });
              this.Historial = {mensajes:[]}     
            }
          });
        }
        else{
          this.cdr.detectChanges();  
          this.chatService.event$.subscribe( (res:any) => {
            this.Historial.mensajes.push(res);
            this.cdr.detectChanges(); 
          });
        }
      }
    });
    
    // buscar datos del usuario otro participante
    if(this.userid_otro_participante!=-1){
      this.chatService.getusuario(this.userid_otro_participante).subscribe({
        next: (data: any) => {
          this.respuesta = { ...this.respuesta, ...data }
        },
        error: (error: any) => {
          //console.log(error);
          return;
        },
        complete: () => {
          this.usuario_otro_participante = this.respuesta.body;
          //console.log("Nombre del otro participante: ",this.usuario_otro_participante.nombre);
          this.cdr.detectChanges();
        }
      });
    }   
  }  

  enviarmensaje(){
    if(this.Nmensaje.trim()==""){
      return;
    }
    let mensaje = {
      emisor: this.tipo,
      texto: this.Nmensaje,
      fecha: this.datetime.transform((new Date), 'MM/dd/yyyy h:mm:ss'),
    }      
    this.chatService.postmensaje(this.id_estudiante, this.id_encargado, mensaje, this.correo_estudiante, this.correo_encargado).subscribe({
      next: (data: any) => {
        this.respuesta = { ...this.respuesta, ...data }
        //console.log("Request aceptada");
      },
      error: (error: any) => console.log("Error en enviar mensaje:",error),  
      complete: () =>{
        console.log(this.tipo);
        let noti: string = "";
        if(mensaje.emisor == "encargado"){
          noti = "El encargado "+ this.nombre_encargado +" te ha enviado un mensaje"
          let enlace:string = "http://localhost:4200/chat/sala" + this.id_estudiante + this.id_encargado + "/" + this.id_estudiante + "/" + this.id_encargado + "/estudiante";
          this.service_noti.postnotificacion(this.id_estudiante, noti, this.correo_estudiante, this.estado_config_estudiante, enlace).subscribe({
            next:(data:any) => {
              this.respuesta = {...this.respuesta, ...data};
            },
            error:(error:any) => {
              console.log(error);
              return;
            },
            complete:() => {

            }
          });
        }
        else if (mensaje.emisor == "estudiante"){
          noti = "El alumno "+ this.nombre_estudiante +" te ha enviado un mensaje"
          let enlace:string = "http://localhost:4200/chat/sala" + this.id_estudiante + this.id_encargado + "/" + this.id_encargado + "/" + this.id_estudiante + "/encargado";
          this.service_noti.postnotificacion(this.id_encargado, noti, this.correo_encargado, this. estado_config_encargado, enlace).subscribe({
            next:(data:any) => {
              this.respuesta = {...this.respuesta, ...data};
            },
            error:(error:any) => {
              console.log(error);
              return;
            },
            complete:() => {
              //console.log("Notificación enviada con éxito");
            }
          });
        }
        //console.log("Mensaje Enviado", mensaje);
        //console.log(this.respuesta);
        this.chatService.emitEvent(mensaje);
        this.Nmensaje="";    
        this.Historial.mensajes.push(mensaje);
        this.sendButton.nativeElement.click();
        this.cdr.detectChanges(); 
      }
    });
  };

  isEnviarButtonDisabled() {
    return this.Nmensaje.trim() === ''; // Disable button if input field is empty
  }

  updateButtonState() {
    this.cdr.detectChanges(); // Trigger change detection
  }

  volver_atras(){
    window.history.back();
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom(); // Scroll to the bottom after view initialization
  }

  // Method to scroll to the bottom of the chat container
  scrollToBottom() {
    if (this.messageContainer) {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter behavior (carriage return)
      this.enviarmensaje();
    }
  }
}
