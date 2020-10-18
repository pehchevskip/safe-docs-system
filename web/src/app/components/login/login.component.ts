import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';

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

  @ViewChild('usernameInput', { static: true }) usernameInput: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isUserLoggedIn.pipe(take(1)).subscribe(isUserLoggedIn => {
      if (isUserLoggedIn) {
        this.navigateToHome();
      }
    });
    this.usernameInput.nativeElement.focus();
  }

  handleLogin() {
    if (this.spinnerVisible) {
      return;
    }
    this.spinnerVisible = true;
    this.invalidLogin = false;

    this.authService.doLogin(this.username, this.password)
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

}
