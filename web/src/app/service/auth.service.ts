import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
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

  doRegister(username: string, password: string, file: File) {
    this.apiUrl = environment.apiUrl;
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('publicKeyPem', file);
    return this.http.post(this.apiUrl + '/users', formData).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(new Error('The provided credentials are invalid.'));
        }
        return throwError(new Error('A server error happened.'));
      }),
    );
  }

  doLogin(username: string, password: string) {
    this.apiUrl = environment.apiUrl;
    return this.http.post(this.apiUrl + '/login', null, {
      headers: {
        authorization: AuthService.createBasicAuthToken(username, password)
      },
      responseType: 'text'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(new Error('The provided credentials are invalid.'));
        }
        return throwError(new Error('A server error happened.'));
      }),
      switchMap((response) => {
        this.username = username;
        this.password = password;
        this.registerSuccessfulLogin(username);
        return of({});
      })
    );
  }

  static createBasicAuthToken(username: string, password: string) {
    return 'Basic ' + window.btoa(`${ username }:${ password }`);
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
