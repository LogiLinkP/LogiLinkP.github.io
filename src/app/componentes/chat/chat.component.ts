import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotisChatService } from 'src/app/servicios/notis-chat/notis-chat.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  Id: number = -1;
  Nmensaje:String="";
  Historial:any=[
    {emisor: "YO",
    texto: "hola",
    fecha: "HOY"}
  ];
  alumno:any = []

  constructor(private service: NotisChatService, private router: ActivatedRoute, private datetime: DatePipe) {
    this.router.params.subscribe(params => {this.Id = +params['id'];});
  }

  enviarmensaje(){
    let mensaje = {
      emisor: this.Id,
      texto: this.Nmensaje,
      fecha: this.datetime.transform((new Date), 'MM/dd/yyyy h:mm:ss'),
    }

    this.service.postmensaje().subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
        console.log("Respuesta actualizar horas:",data);
      },
      error: (error: any) => console.log("Error en enviar mensaje:",error),  
      complete: () => {
        let id_config_informe = 1;
        console.log("Ingresar informe");
        this.service.ingresar_informe(this.practica.id, key, id_config_informe).subscribe({
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
    });;

    this.Historial.push(mensaje);
    this.Nmensaje="";
  }

  ngOnInit(): void {
    let respuesta: any = {};

    this.service.getchat().subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => console.log(error),
      complete: () => {
        this.alumno = respuesta.body;
        this.link_finalizacion = "/alumno/"+this.alumno.id+"/finalizacion/1";
        this.link_inscripcion = "/alumno/"+this.alumno.id+"/iniciarpractica/1"; 
      }
    });
  }  
}
