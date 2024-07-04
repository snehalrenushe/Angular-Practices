import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

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
    return this.http.post(this.apiUrl + '/users', data);
  }

  editUser(
    id: string,
    name: string,
    age: number,
    password: string,
    email: string,
    address: string
  ): Observable<any> {
    const user: Partial<User> = { name, age, password, email, address };

    return this.http.put(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: string) {
    const data = {
      id,
    };
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
}
