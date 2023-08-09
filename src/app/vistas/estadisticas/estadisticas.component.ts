import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss',
              '../../../assets/css/sb-admin-2.min.css',
              '../../../assets/vendor/fontawesome-free/css/all.min.css']
})
export class EstadisticasComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }
}
