import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-migrar-modal',
  templateUrl: './migrar-modal.component.html',
  styleUrls: ['./migrar-modal.component.scss']
})
export class MigrarModalComponent {
    @Input()
    migrarLegal: boolean;
}
