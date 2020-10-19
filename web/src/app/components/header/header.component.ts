import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  loggedInUser = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isUserLoggedIn$.subscribe(isUserLoggedIn => {
      this.isLoggedIn = isUserLoggedIn;
    });
    this.authService.loggedInUser$.subscribe(username => {
      this.loggedInUser = username;
    });
  }

  handleLogout() {
    this.authService.logout();
  }

}
