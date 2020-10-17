import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

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
    this.authService.isUserLoggedIn.pipe(take(1)).subscribe(isUserLoggedIn => {
      if (!isUserLoggedIn) {
        this.router.navigate([ '/login' ]);
      }
    });
  }

}
