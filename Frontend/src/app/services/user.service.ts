import { Injectable } from '@angular/core';
import { User } from '../model/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  localUser: User[] = [
    {
    userId: 1,
    username: 'user1',
    email: 'user@gmail.com',
    password: 'hallo'
    }
  ]

  loadUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) as User : null;
  }
  checkLogin(email: string, password: string) {
    return this.localUser.find(user => user.email === email 
      && user.password === password) || null;
  }
    resetPassword(email: string): User | null {
    throw new Error('Method not implemented.');
  }

}
