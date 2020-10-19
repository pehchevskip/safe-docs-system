import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isLoggedIn = this.authService.isUserLoggedIn;

    if (isLoggedIn && !req.headers.get('Authorization')) {
      req = req.clone({
        setHeaders: {
          Authorization: AuthService.createBasicAuthToken(this.authService.username, this.authService.password)
        }
      });
    }
    return next.handle(req);
  }

}
