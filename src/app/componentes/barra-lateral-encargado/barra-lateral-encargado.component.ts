import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-barra-lateral-encargado',
  templateUrl: './barra-lateral-encargado.component.html',
  styleUrls: ['./barra-lateral-encargado.component.scss']
})
export class BarraLateralEncargadoComponent {
  rutas = environment;
  practicas: string[];
}
