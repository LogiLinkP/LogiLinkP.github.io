import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { StorageUserService } from 'src/app/servicios/usuario/storage-user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(public usuario: UsuarioService, private storage: StorageUserService, private router: Router){}

  ngOnInit(): void {
  }

  login(){
    let response: any = {};
    const user = { email: this.email, password: this.password };
    this.usuario.login(this.email,this.password).subscribe( {
      next: data => {
        response = {...response,...data}
      },
      error: err => {
        console.log("Error de inicio de sesion");
      },
      complete: () => {
        if(response.body != null){
          const {message,userdata,token} = response.body;
          this.storage.saveUser(response.body)
          this.router.navigate(["/encargado"])  

        }else{
          document.write("Usuario no encontrado")
        }
      }
        
  });
  }
}
