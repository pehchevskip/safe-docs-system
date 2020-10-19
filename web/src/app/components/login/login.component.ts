import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.sass' ]
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  errorMessage = 'Invalid username or password';
  invalidLogin = false;
  loginSuccess = false;
  spinnerVisible = false;

  @ViewChild('usernameInput', { static: true }) usernameInput: ElementRef<HTMLInputElement>;
  @ViewChild('loginForm') loginForm: ElementRef<HTMLFormElement>;

  private privateKeyFile: File;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    const isLoggedIn = this.authService.isUserLoggedIn;
    if (isLoggedIn) {
      this.navigateToHome();
    }
    this.usernameInput.nativeElement.focus();
  }

  handleLogin() {
    if (this.spinnerVisible) {
      return;
    }
    if (!this.loginForm.nativeElement.checkValidity()) {
      this.errorMessage = 'All fields are required.';
      this.invalidLogin = true;
      return;
    }
    const privateKeyFileType = this.privateKeyFile.type;
    if ((privateKeyFileType !== 'application/x-x509-ca-cert') && (privateKeyFileType !== 'application/x-pem-file')) {
      this.errorMessage = 'The provided private key file is not of type PEM.';
      this.invalidLogin = true;
      return;
    }
    this.spinnerVisible = true;
    this.invalidLogin = false;

    this.authService.doLogin(this.username, this.password, this.privateKeyFile)
      .pipe(
        finalize(() => this.spinnerVisible = false)
      )
      .subscribe((response) => {
        this.invalidLogin = false;
        this.loginSuccess = true;
        this.navigateToHome();
      }, (error: Error) => {
        this.errorMessage = error.message;
        this.invalidLogin = true;
        this.loginSuccess = false;
      });
  }

  private navigateToHome() {
    this.router.navigate([ '/home' ]);
  }

  handlePrivateKeyFileInput(files: FileList) {
    this.privateKeyFile = files.item(0);
  }
}
