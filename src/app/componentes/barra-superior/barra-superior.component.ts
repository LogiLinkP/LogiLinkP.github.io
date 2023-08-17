import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUsuarioService } from 'src/app/servicios/data_usuario/data-usuario.service';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';

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
  usuarios:any=[];

  id1:number = 0;

  constructor(private Service: DataUsuarioService, private Salumno: ObtenerDatosService, private router: ActivatedRoute){
    this.router.params.subscribe(params => {this.Id = +params['id'];});
  }

  ngOnInit(): void {
    this.Service.obtener_estudiante(this.Id).subscribe({
      next: (data: any) => {
        this.respuesta = { ...this.respuesta, ...data }
      },
      complete: () => {
        this.es_alumno = 1;
        this.Yo = this.respuesta.body;
        this.id1=this.Yo.id;
        this.Salumno.obtener_practica(this.Yo.id).subscribe({
          next: (data:any) =>{
            this.respuesta = { ...this.respuesta, ...data}
          },
          error: (error: any) => {
            console.log(error);
            return;
          },
          complete:() => {
            this.usuarios = this.respuesta.body;
            console.log(this.usuarios);
          }
        })
      },
      error: (error: any) => {
        this.es_alumno=0;
        this.Service.obtener_encargado(this.Id).subscribe({
          next: (data: any) => {
            this.respuesta = { ...this.respuesta, ...data }
          },
          error: (error: any) => {
            console.log(error);
            return;
          },
          complete: () => {
            this.usuarios = this.respuesta.body;
          }  
        });  
      }, 
    });  
  }
}
