import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotisChatService } from 'src/app/servicios/notis-chat/notis-chat.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

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

  tipo: String = "";

  Nmensaje:String="";
  Historial:any=[];

  usuario_otro_participante: any = [];

  respuesta:any = [];
  room: string="";

  constructor(private service: NotisChatService,
              private router: ActivatedRoute,
              private datetime: DatePipe,
              private cookie: CookieService, private cdr: ChangeDetectorRef) {

    let auth_user = JSON.parse(localStorage.getItem("auth-user") || "{}");

    this.router.params.subscribe(params => {this.Id = +params['id1'];});
    this.router.params.subscribe(params => {this.Id2 = +params['id2'];});
    this.id_usuario = auth_user.userdata.id;
    this.router.params.subscribe(params => {this.tipo = params['tipo'];});

    let id_aux = this.router.snapshot.queryParamMap.get('userid_otro_participante');
    if(id_aux!=null){
      this.userid_otro_participante = +id_aux;
    }

    this.service.outEven.subscribe(res => {
      this.enviarmensaje();
    })
  }

  ngOnInit(): void{  
    console.log("SETEANDO COOKIEEEEEEE")
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
    console.log("Id usuario: ", this.id_usuario);
    console.log("userid otro participante: ", this.userid_otro_participante);

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
        this.cdr.detectChanges();  
        this.service.event$.subscribe(res => {
          this.Historial.mensajes.push(res);
          this.cdr.detectChanges(); 
        });
      }
    });
    
    // buscar datos del usuario otro participante
    if(this.userid_otro_participante!=-1){
      this.service.getusuario(this.userid_otro_participante).subscribe({
        next: (data: any) => {
          this.respuesta = { ...this.respuesta, ...data }
        },
        error: (error: any) => {
          console.log(error);
          return;
        },
        complete: () => {
          this.usuario_otro_participante = this.respuesta.body;
          console.log("Nombre del otro participante: ",this.usuario_otro_participante.nombre);
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
    this.service.postmensaje(this.id_estudiante, this.id_encargado, mensaje).subscribe({
      next: (data: any) => {
        this.respuesta = { ...this.respuesta, ...data }
        console.log("Request aceptada");
      },
      error: (error: any) => console.log("Error en enviar mensaje:",error),  
      complete: () => {
        console.log("Mensaje Enviado", mensaje);
        console.log(this.respuesta);
        this.service.emitEvent(mensaje);
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
}
