import { CanActivateFn ,ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { StorageUserService } from './storage-user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

class authGuard {
  constructor(public storage: StorageUserService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    const user = this.storage.getUser();
    if(!this.storage.isLoggedIn() || user.es_estudiante !== true){
      this.router.navigate([environment.ruta_alumno]);
      return false;
    }
    return true;  
  }
}


export const estudianteGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(authGuard).canActivate(next, state);
};
