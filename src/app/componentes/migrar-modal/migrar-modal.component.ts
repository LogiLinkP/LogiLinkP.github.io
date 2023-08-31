import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-migrar-modal',
  templateUrl: './migrar-modal.component.html',
  styleUrls: ['./migrar-modal.component.scss']
})
export class MigrarModalComponent {
    @Input()
    migrarLegal: boolean;

    @Output() mandarDatosMigrar = new EventEmitter<boolean>();

    callParent() {
        //console.log("clicked migrar");
        this.mandarDatosMigrar.emit(this.migrarLegal);
    }
}
