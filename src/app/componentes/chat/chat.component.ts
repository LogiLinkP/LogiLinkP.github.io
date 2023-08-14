import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotisChatService } from 'src/app/servicios/notis-chat/notis-chat.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  Id: number = -1;
  Id2: number = -1;
  Nmensaje:String="";
  Historial:any=[];
  alumno:any = [];
  respuesta:any = [];
  res:any=[];

  constructor(private service: NotisChatService, private router: ActivatedRoute, private datetime: DatePipe) {
    this.router.params.subscribe(params => {this.Id = +params['id'];});
    this.router.params.subscribe(params => {this.Id2 = +params['id2'];});

    this.service.outEven.subscribe(res => {
      const { prevPost } = res;
      this.enviarmensaje();
    })
  }

  ngOnInit(): void{    
    
    //this.service.getchat(this.Id,this.Id2).subscribe({
    //  next: (data: any) => {
    //    this.respuesta = { ...this.respuesta, ...data }
    //    console.log("Request Aceptada, chat recibido");
    //  },
    //  error: (error: any) => console.log(error),
    //  complete: () => {
    //    this.Historial = respuesta;
    //  }
    //});
  }  

  enviarmensaje(){
    let mensaje = {
      emisor: this.Id,
      texto: this.Nmensaje,
      fecha: this.datetime.transform((new Date), 'MM/dd/yyyy h:mm:ss'),
    }

    this.service.postmensaje(this.Id, this.Id2, mensaje).subscribe({
      next: (data: any) => {
        this.respuesta = { ...this.respuesta, ...data }
        console.log("Request aceptada");
        this.service.emitEvent({this.respuesta});
      },
      error: (error: any) => console.log("Error en enviar mensaje:",error),  
      complete: () => {
        console.log("Mensaje Enviado");
        console.log(this.respuesta);
        this.Nmensaje="";
      }
    });
  };

  
}
