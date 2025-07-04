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
    const userFromStorage = localStorage.getItem('user');
    let parsedUser: User | null = null;
    try {
      parsedUser = userFromStorage ? JSON.parse(userFromStorage) : null;
    } catch (e) {
      localStorage.removeItem('user');
      parsedUser = null;
    }
    this.userSubject = new BehaviorSubject<User | null>(parsedUser);
    this.user = this.userSubject.asObservable();
  }

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
        localStorage.setItem('userId', JSON.stringify(user.userId));
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
    return this.http.get<User>(`${this.apiUrl}/by-mail`, {
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

  updateUser(userId: string, updateData: Partial<User>) {
    return this.http.put<{ message: string, user: User }>(`${this.apiUrl}/${userId}`, updateData,
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  updateLocalUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  delete(userId: string) {
    return this.http.delete(`${this.apiUrl}/${userId}`)
    .pipe(map(u => {
      if (userId === this.userSubject.value?.userId) 
        this.logout();
      return u;
    }))
  }
}


