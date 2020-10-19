import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(){
    const isLoggedIn = this.authService.isUserLoggedIn;
    if (!isLoggedIn) {
      this.router.navigate([ '/login' ]);
    }
  }

}
