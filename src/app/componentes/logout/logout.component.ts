import { Component } from '@angular/core';
import { StorageUserService } from 'src/app/servicios/usuario/storage-user.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  username?: string;

  constructor(private storage: StorageUserService, private usuario: UsuarioService) { }

  ngOnInit(): void {
    if(this.storage.isLoggedIn()){
      const user = this.storage.getUser();
      this.username = user.username;
    }
  }

  logout(): void {
    this.usuario.logout().subscribe({
      next: res => {
        console.log(res);
        this.storage.clean();

        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
