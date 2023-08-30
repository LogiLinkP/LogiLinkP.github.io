import { Component } from '@angular/core';
import { StorageUserService } from 'src/app/servicios/usuario/storage-user.service';
import { UsuarioService } from 'src/app/servicios/usuario/usuario.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss']
})
export class LogoutModalComponent {
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
        this.router.navigate(['/']);
        const modalBackdrop = document.querySelector('.modal-backdrop');        
        if(modalBackdrop){
          modalBackdrop.remove();
        }       
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
