import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss'
})

export class PasswordRecoveryComponent {
  loginForm: FormGroup;
  password1: string;
  password2: string;
  id: number

  constructor(
    public usuario: UsuarioService, 
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      password1: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  ngOnInit(){
    const urls = this.route.snapshot.url
    this.id = Number.parseInt(urls[-1]?.path)
  }

  send() {
    let response: any = {};
    const data = this.loginForm.value;
    console.log(data);
    console.log(this.id)
    this.password1 = data.password1
    this.password2 = data.password2

    if (this.password1 === this.password2) {
      this._snackBar.open("Las contraseñas no coindiden", "OK", {
        duration: 5000,
      });
    }
    else{
      this.usuario.change_password(this.id, this.password1).subscribe({
        next: data =>{
          response = { ...response, ...data }
        },
        error: err => {
          this._snackBar.open(err.error.message, "OK", {
            duration: 5000,
          });
        },
        complete: () => {
          this.router.navigate(["/login"])
        }
      })
    }
  }
}
