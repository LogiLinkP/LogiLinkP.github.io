import { Component } from '@angular/core';
import { StorageUserService } from 'src/app/servicios/usuario/storage-user.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  username?: string;

  constructor(private storage: StorageUserService, private usuario: UsuarioService, private router: Router) { }

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
      },
      error: err => {
        console.log(err);
      },
      complete: ()=>{
        this.router.navigate(['/'])
      }
    });
  }
}
