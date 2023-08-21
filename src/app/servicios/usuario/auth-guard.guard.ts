import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { StorageUserService } from './storage-user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


class authGuard {
  constructor(public storage: StorageUserService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(!this.storage.isLoggedIn()){
      this.router.navigate([environment.ruta_login]);
      return false;
    }
    return true;
  }
}

export const authGuardGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(authGuard).canActivate(next, state);
};
