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
      if (isUserLoggedIn && req.url.indexOf('basicauth') < 0) {
        const authReq = req.clone({
          headers: new HttpHeaders({
            authorization: AuthService.createBasicAuthToken(this.authService.username, this.authService.password)
          })
        });
        return next.handle(authReq);
      }
      return next.handle(req);
    });
    return next.handle(req);
  }

}
