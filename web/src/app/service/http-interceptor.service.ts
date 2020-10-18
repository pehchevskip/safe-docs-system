import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.isUserLoggedIn.pipe(take(1)).subscribe(isUserLoggedIn => {
      if (isUserLoggedIn && !req.headers.get('Authorization')) {
        req = req.clone({
          setHeaders: {
            Authorization: AuthService.createBasicAuthToken(this.authService.username, this.authService.password)
          }
        });
      }
      return next.handle(req);
    });
    return next.handle(req);
  }

}
