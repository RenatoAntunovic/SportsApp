import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserUpdate, PasswordChange } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateMe(data: UserUpdate): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, data);
  }

  changePassword(data: PasswordChange): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/me/password`, data);
  }
}