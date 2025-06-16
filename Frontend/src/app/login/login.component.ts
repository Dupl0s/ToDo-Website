import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../model/user.type';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  userService = inject(UserService)

  handleSubmit() {
    if (typeof this.userForm.value.email === 'string' && typeof this.userForm.value.password === 'string') {
      const user: User | null = this.userService.checkLogin(this.userForm.value.email, this.userForm.value.password);
      if (user) {
        alert(
          "Hallo " + user.username + "!"
        );
      } else {
        alert("Login fehlgeschlagen: Benutzer nicht gefunden oder ungültige Anmeldedaten!");
      }
    } else {
      alert(
        this.userForm.value.email + ' | ' + this.userForm.value.password + " ist nicht gültig!");
    }

  }
}
