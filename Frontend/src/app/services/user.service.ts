import { inject, Injectable } from '@angular/core';
import { User } from '../model/user.type';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  private http = inject(HttpClient);
  private readonly apiUrl = '/user';


  constructor() {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  localUser: User[] = [
    {
      userId: 1,
      username: 'user1',
      email: 'user@gmail.com',
      password: 'hallo123'
    }
  ]

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  loadUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) as User : null;
  }

  checkLogin(email: string, password: string) {
    localStorage.removeItem('user');
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password })
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  checkMail(findEmail: string) {
    return this.http.get<User>(this.apiUrl, {
      params: { email: findEmail },
    });
  }

  resetPassword(email: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/reset-password`, { email });
  }

  createUser(name: string, newEmail: string, newPassword: string) {
    return this.http.post<User>(this.apiUrl, {
      username: name,
      email: newEmail,
      password: newPassword,
    });
  };
}


