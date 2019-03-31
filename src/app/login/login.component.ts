import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hasError: boolean;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {

  }

  ngOnInit() {

  }

  public login(form: any): void {
    this.userService.login(form.email, form.password)
      .subscribe(
        (res) => {

          console.log(res.result);
          if (res.result.length < 1) {
            this.hasError = true;

          } else {
            this.router.navigate(['calendar']);
          }


        }
      );
  }

}
