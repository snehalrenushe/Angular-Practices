import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(this.apiUrl + '/users');
  }

  addUser(
    name: string,
    age: number,
    password: string,
    email: string,
    address: string
  ) {
    const data = {
      name,
      age,
      password,
      email,
      address,
    };

    console.log(data);

    return this.http.post(this.apiUrl + '/users', data);
  }
}
