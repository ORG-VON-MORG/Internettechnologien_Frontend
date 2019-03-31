import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  public register(
    firstname: string, 
    lastname: string, 
    email: string, 
    password: string
  ): Observable<any> {
    return this.http.post('http://localhost:1701/users', null,
      {
        params: {
          email: email,
          vorname: firstname,
          nachname: lastname,
          password: password
        }, 
        observe: 'response'
      }
    );
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.get('http://localhost:1701/users',
      {
        params: {
          email: email,
          password: password
        },
        observe: 'body'
      }
    );
  }

}
