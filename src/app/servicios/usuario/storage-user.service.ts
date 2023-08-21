import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageUserService {

  constructor(public jwtHelper: JwtHelperService) { }

  clean(): void {
    window.localStorage.clear();
  }

  public saveUser(user: any, token: any): void {
    this.setToken(token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public isLoggedIn(): boolean {
    const token = this.getToken()
    return !this.jwtHelper.isTokenExpired(token);
  }

  public setToken(token: any){
    window.localStorage.setItem("token",token);
  }

  public getToken(){
    return window.localStorage.getItem("token");
  }
}
