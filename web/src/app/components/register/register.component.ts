import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  username: string;
  password: string;

  spinnerVisible = false;
  invalidRegisterCall: boolean;
  registerSuccess: boolean;

  errorMessage: string;

  private file: File = null;

  @ViewChild('usernameInput', { static: true }) usernameInput: ElementRef;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    const isLoggedIn = this.authService.isUserLoggedIn;
    if (isLoggedIn) {
      this.navigateToHome();
    }
    this.usernameInput.nativeElement.focus();
  }

  handleRegister() {
    if (this.spinnerVisible) {
      return;
    }
    this.spinnerVisible = true;
    this.invalidRegisterCall = false;

    this.authService.doRegister(this.username, this.password, this.file).pipe(
      finalize(() => this.spinnerVisible = false)
    ).subscribe(() => {
      this.invalidRegisterCall = false;
      this.registerSuccess = true;
      this.navigateToLogin();
    }, (error: Error) => {
      this.errorMessage = error.message;
      this.invalidRegisterCall = true;
      this.registerSuccess = false;
    });
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  navigateToLogin() {
    this.router.navigate([ '/login' ]);
  }

  navigateToHome() {
    this.router.navigate([ '/home' ]);
  }

}
