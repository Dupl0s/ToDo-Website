import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../model/user.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
  });

  userService = inject(UserService)
  handleSubmit() {
    if (typeof this.registrationForm.value.email === 'string'
      && typeof this.registrationForm.value.password === 'string'
      && typeof this.registrationForm.value.name === 'string') {
      const user: User | null = this.userService.checkLogin(this.registrationForm.value.email, this.registrationForm.value.password);
      if (user) {
        alert(
          user.username + "already registrated!"
        );
      }
      else {
        /* Post Methode */
        alert("Registrierung erfolgreich!");
      }
    } else {
      alert(
        "Something went wrong. Try again later.");
    }
  }
};
