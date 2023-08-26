import { Component } from '@angular/core';
import { StorageUserService } from 'src/app/servicios/usuario/storage-user.service';

@Component({
  selector: 'app-informaciones',
  templateUrl: './informaciones.component.html',
  styleUrls: ['./informaciones.component.scss']
})
export class InformacionesComponent {

  constructor(private storage: StorageUserService) { }

  logout(): void {
    this.storage.clean();    
    window.location.reload();
    document.body.classList.remove('modal-open');
  }

}
