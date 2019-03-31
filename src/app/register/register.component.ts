import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Form } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public isRegisterd = false;

  constructor(
    private router: Router, 
    private userService: UserService
  ) { 

  }

  ngOnInit() {
  }

  public registerUser(form: any): void {
    this.userService.register(
      form.firstname,
      form.lastname,
      form.email,
      form.password
    )
    .subscribe(
      (res) => {
        this.isRegisterd = true;
      }, 
      (err) => {
        if (err.error.err.errno === 19) {
          console.log('SQLITE_CONSTRAINT');
        }
      }
    );
  }

}
