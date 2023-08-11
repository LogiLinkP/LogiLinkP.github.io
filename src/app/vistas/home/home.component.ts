import { Component } from '@angular/core';
import { StorageUserService } from '../../servicios/usuario/storage-user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = "Praxus"

  constructor(private storage: StorageUserService){
    console.log("hola",this.storage.getUser())
  }
}
