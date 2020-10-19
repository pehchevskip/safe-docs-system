import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { clearFileInLocalStorage, localStorageKeys, saveFileInLocalStorage } from '../utils/local-storage.utils';
import { isNilOrEmpty } from '../utils/string.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionStorageKeys = {
    authenticatedUsername: 'authenticatedUsername',
    authenticatedPassword: 'authenticatedPassword'
  };

  username: string;
  password: string;

  private isLoggedIn = new BehaviorSubject(false);
  private loggedInUsername = new BehaviorSubject(null);
  private apiUrl: string;

  constructor(private http: HttpClient) {
    const username = sessionStorage.getItem(this.sessionStorageKeys.authenticatedUsername);
    this.loggedInUsername.next((username && username.length > 0) ? username : null);
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

  doLogin(username: string, password: string, privateKeyFile: File) {
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
        this.registerSuccessfulLogin(username, password, privateKeyFile);
        return of({});
      })
    );
  }

  static createBasicAuthToken(username: string, password: string) {
    return 'Basic ' + window.btoa(`${ username }:${ password }`);
  }

  private registerSuccessfulLogin(username: string, password: string, privateKeyFile: File) {
    this.username = username;
    this.password = password;

    saveFileInLocalStorage(localStorageKeys.privateKeyFile, privateKeyFile);
    sessionStorage.setItem(this.sessionStorageKeys.authenticatedUsername, username);
    sessionStorage.setItem(this.sessionStorageKeys.authenticatedPassword, password);
    this.loggedInUsername.next(username);
    this.isLoggedIn.next(true);
  }

  logout() {
    clearFileInLocalStorage(localStorageKeys.privateKeyFile);
    sessionStorage.removeItem(this.sessionStorageKeys.authenticatedUsername);
    sessionStorage.removeItem(this.sessionStorageKeys.authenticatedPassword);
    this.username = null;
    this.password = null;
    this.loggedInUsername.next(null);
    this.isLoggedIn.next(false);
  }

  get isUserLoggedIn(): boolean {
    return this.checkIfUserIsLoggedIn();
  }

  get isUserLoggedIn$(): Observable<boolean> {
    this.isLoggedIn.next(this.checkIfUserIsLoggedIn());
    return this.isLoggedIn.asObservable();
  }

  private checkIfUserIsLoggedIn(): boolean {
    this.username = sessionStorage.getItem(this.sessionStorageKeys.authenticatedUsername);
    this.password = sessionStorage.getItem(this.sessionStorageKeys.authenticatedPassword);

    return !isNilOrEmpty(this.username) && !isNilOrEmpty(this.password);
  }

  get loggedInUser(): string {
    return this.loggedInUsername.value;
  }

  get loggedInUser$(): Observable<string> {
    return this.loggedInUsername.asObservable();
  }
}
