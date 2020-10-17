import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isUserLoggedIn.subscribe(isUserLoggedIn => {
      this.isLoggedIn = isUserLoggedIn;
    });
  }

  handleLogout() {
    this.authService.logout();
  }

}
