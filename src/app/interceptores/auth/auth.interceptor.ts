import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = new Router();
  const token = JSON.parse(localStorage.getItem("auth-user") ?? "{}").token;
  if (router.url !== "/" && router.url !== `/${environment.ruta_login}`) {
    if (!token) {
      router.navigateByUrl(`/`);
    }
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `${token}`
    }
  });
  return next(authReq);
};
