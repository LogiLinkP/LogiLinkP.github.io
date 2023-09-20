import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject} from '@angular/core';
import { ObtenerDatosService } from 'src/app/servicios/alumno/obtener_datos.service';

@Component({
  selector: 'app-ingreso-informe',
  templateUrl: './ingreso-informe.component.html',
  styleUrls: ['./ingreso-informe.component.scss']
})
export class IngresoInformeComponent {
  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, 
  private service_obtener: ObtenerDatosService, private route: ActivatedRoute, 
  private _snackbar: MatSnackBar) {}

  activated_route: ActivatedRoute = this.route;
  id_informe: number = 0;
  sesion: any = JSON.parse(localStorage.getItem("auth-user") || "{}")

  pregunta_actual = 0;

  contador_preguntas = 0;

  preguntas: any[] = [];
  tipo_respuestas: any[] = [];
  respuestas: any[] = [];


  isAnimating = false;
  izq() {
    if (this.isAnimating) {
      return; // Don't allow animation if one is already in progress
    }

    this.contador_preguntas -= 1;
    //console.log("CONTADOR PREGUNTAS", this.contador_preguntas);
    
    let id = `#cont_respuesta${this.pregunta_actual}`;
    let id_izq = `#cont_respuesta${this.pregunta_actual - 1}`;
  
    this.isAnimating = true; // Set the flag
  
    $(id).fadeOut(() => {
      $(id).css("display", "none");
      $(id_izq).css({ "display": "block" });
      $(id_izq).fadeIn(() => {
        this.isAnimating = false; // Reset the flag when animation is complete
      });
      this.pregunta_actual -= 1;
    });
  }

  der() {
    if (this.isAnimating) {
      return; // Don't allow animation if one is already in progress
    }
    
    this.contador_preguntas += 1;
    //console.log("CONTADOR PREGUNTAS", this.contador_preguntas);

    let id = `#cont_respuesta${this.pregunta_actual}`;
    let id_der = `#cont_respuesta${this.pregunta_actual + 1}`;
  
    this.isAnimating = true; // Set the flag
  
    $(id).fadeOut(() => {
      $(id).css("display", "none");
      $(id_der).css({ "display": "block" });
      $(id_der).fadeIn(() => {
        this.isAnimating = false; // Reset the flag when animation is complete
      });
      this.pregunta_actual += 1;
    });
  }

  ngOnInit(): void {
    this.id_informe = parseInt(this.activated_route.snapshot.queryParamMap.get('id_informe') || "{}");
    let respuesta: any = {};

    this.service_obtener.obtener_informe_preguntas(this.id_informe).subscribe({
      next: (data: any) => {
        respuesta = { ...respuesta, ...data }
      },
      error: (error: any) => {
        console.log(error);
        this._snackbar.open("Error al obtener las preguntas de informe de avances", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
      },
      complete: () => {
        //console.log("RESPUESTA OBTENIDA", respuesta);
        this.preguntas = respuesta.body.config_informe.pregunta_informes;

        for (let i = 0; i < this.preguntas.length; i++) {
          this.tipo_respuestas.push(this.preguntas[i].tipo_respuesta);
          this.respuestas.push("");
        }
      }
    });
  }



  updateRespuestasAbierta(index: number, value: string) {
    //console.log("UPDATEANDO RESPUESTAS abierta", value)
    this.respuestas[index] = value;
    //console.log(this.respuestas);
  }

  updateRespuestasCasillas(i: number, j: number, value: string) {
    //console.log("UPDATEANDO RESPUESTAS casillas", value)
    this.respuestas[i][j] = value;
    //console.log(this.respuestas);
  }

  updateRespuestasAlternativas(i: number, value: string) {
    //console.log("UPDATEANDO RESPUESTAS alternativas", value);
    this.respuestas[i] = value;
    //console.log(this.respuestas);
  }

  enviarRespuestas() {
    console.log("Enviando evaluación...")
    console.log(this.respuestas);

    let respuestas_aux = {};

    for (let i = 0; i < this.respuestas.length; i++) {
      if (this.respuestas[i] == "" || this.respuestas[i] == -1 || this.respuestas[i].length == 0) {
        this._snackbar.open("Error: no se han respondido todas las preguntas.", "Cerrar", {
          duration: 2000,
          panelClass: ['red-snackbar']
        });
        return;
      }
    }

    // for que convierte las respuestas al formato acordado, y los guarda en el campo key de informe

    for (let i = 0; i < this.respuestas.length; i++) {
      let respuesta_aux = "";

      if (this.tipo_respuestas[i] == "casillas") {
        for (let j = 0; j < this.respuestas[i].length; j++) {
          if (this.respuestas[i][j]) {
            respuesta_aux += "1";
          }
          else {
            respuesta_aux += "0";
          }
          if (j != this.respuestas[i].length - 1) {
            respuesta_aux += ",";
          }
        }
      }
      else if (this.tipo_respuestas[i] == "alternativas") {
        let index = this.preguntas[i].opciones.split(";;").indexOf(this.respuestas[i]);
        for (let j = 0; j < this.preguntas[i].opciones.split(";;").length; j++) {
          if (j == index) {
            respuesta_aux += "1";
          }
          else {
            respuesta_aux += "0";
          }
          if (j != this.preguntas[i].opciones.split(";;").length - 1) {
            respuesta_aux += ",";
          }
        }
      }
      else{
        respuesta_aux = this.respuestas[i];
      }
      
      respuestas_aux = { ...respuestas_aux, [String(this.preguntas[i].id)]: respuesta_aux };
    }
    console.log("RESPUESTAS A ENVIAR EN QUERY", respuestas_aux);
    // after 2 seconds, redirect to home
    setTimeout(() => {
      //this.router.navigate(['/alumno/1']);  DESCOMENTAR ESTO DESPUES
    }
      , 3000); 

  }

  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }
  

}
