import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser';

  username: string;
  password: string;

  private isLoggedIn = new BehaviorSubject(false);
  private apiUrl: string;

  constructor(private http: HttpClient) {
  }

  doLogin(username: string, password: string) {
    this.apiUrl = environment.apiUrl;
    return this.http.post(this.apiUrl + '/login', null, {
      headers: {
        authorization: AuthService.createBasicAuthToken(username, password)
      },
      responseType: 'text'
    }).pipe(map(() => {
      this.username = username;
      this.password = password;
      this.registerSuccessfulLogin(username);
    }));
  }

  static createBasicAuthToken(username: string, password: string) {
    return 'Basic ' + window.btoa(`${username}:${password}`);
  }

  private registerSuccessfulLogin(username: string) {
    sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username);
    this.isLoggedIn.next(true);
  }

  logout() {
    sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    this.username = null;
    this.password = null;
    this.isLoggedIn.next(false);
  }

  get isUserLoggedIn(): Observable<boolean> {
    const user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    const isLoggedIn = !AuthService.isNilOrEmpty(this.password) && (user !== null);
    this.isLoggedIn.next(isLoggedIn);
    return this.isLoggedIn.asObservable();
  }

  private static isNilOrEmpty(val: string) {
    return val === null || val === undefined || val.length === 0;
  }

  getLoggedInUsername() {
    const user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    return user || '';
  }
}
