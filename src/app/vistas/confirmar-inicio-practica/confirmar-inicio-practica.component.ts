import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupervisorService } from 'src/app/servicios/supervisor/supervisor.service';

@Component({
  selector: 'app-confirmar-inicio-practica',
  templateUrl: './confirmar-inicio-practica.component.html',
  styleUrls: ['./confirmar-inicio-practica.component.scss']
})
export class ConfirmarInicioPracticaComponent {
  practica_confirmada: boolean = false;
  practica: any = {};
  mostrar_agradecimiento: boolean = false;

  constructor(activated_route: ActivatedRoute, private supervisor_service: SupervisorService) {
    let token = "";
    let iv = "";
    let response: any = {};

    //obtener token y iv de la url
    activated_route.queryParams.subscribe(params => {
      token = params['token'];
      iv = params['iv'];
    });

    //obtener usuario
    this.supervisor_service.getPracticaEncriptada(token, iv).subscribe({
      next: (data: any) => {
        response = { ...response, ...data };
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (response) {
          this.practica = response.body;
          this.practica_confirmada = true;
          if (this.practica.estado != "Esperando confirmacion"){
            this.mostrar_agradecimiento = true;
          }
        }
      }
    });
  }

  confirmarInicioPractica() {
    this.supervisor_service.confirmarInicioPractica(this.practica.id).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        this.mostrar_agradecimiento = true;
      }
    });
  }
}


