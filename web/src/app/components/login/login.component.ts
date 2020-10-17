import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  errorMessage = 'Invalid username or password';
  successMessage: string;
  invalidLogin = false;
  loginSuccess = false;
  loadingLayerVisible = true;

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
  }

  handleLogin() {
    this.authService.doLogin(this.username, this.password).subscribe((response) => {
      this.invalidLogin = false;
      this.loginSuccess = true;
      this.successMessage = 'Login successful';
      this.navigateToHome();
    }, (error) => {
      this.invalidLogin = true;
      this.loginSuccess = false;
    });
  }

  private navigateToHome() {
    this.router.navigate([ '/home' ]);
  }

}
