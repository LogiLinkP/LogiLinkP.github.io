import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObtenerDatosService} from 'src/app/servicios/alumno/obtener_datos.service';
import { DetallePracticaService } from 'src/app/servicios/encargado/detalle-practica.service';

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

  usuarios:any=[];

  constructor(private Salumno: ObtenerDatosService, private Sencargado: DetallePracticaService, private router: ActivatedRoute){
    this.router.params.subscribe(params => {this.Id = +params['id'];});
  }

  ngOnInit(): void {
    if (this.es_alumno == 1){
      this.tipo = "estudiante";
      this.Salumno.obtener_practica(this.Id).subscribe({
        next: (data: any) => {
          this.respuesta = { ...this.respuesta, ...data }
        },
        error: (error: any) => {
          console.log(error);
          return;
        },
        complete: () => {
          this.usuarios = JSON.parse(this.respuesta.body);
        }  
      });  
    }
    else{
      this.tipo = "encargado";
      this.Sencargado.obtener_practica(this.Id).subscribe({
        next: (data: any) => {
          this.respuesta = { ...this.respuesta, ...data }
        },
        error: (error: any) => {
          console.log(error);
          return;
        },
        complete: () => {
          this.usuarios = JSON.parse(this.respuesta.body);
        }  
      });  
    }
  }

}
