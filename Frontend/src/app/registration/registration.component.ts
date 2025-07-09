import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../model/user.type';
import { CommonModule } from '@angular/common';
import { emailDomainValidator } from '../validators/mail.validator';
import { Router } from '@angular/router';
import { passwordRegexValidator } from '../validators/passwort.validator';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email, emailDomainValidator]),
    password: new FormControl('', [Validators.minLength(8), Validators.required, passwordRegexValidator])
  });

  userService = inject(UserService)
  router = inject(Router);

  handleSubmit() {
    const newEmail = this.registrationForm.value.email;
    const newName = this.registrationForm.value.name;
    const newPassword = this.registrationForm.value.password;

    if (typeof newEmail === 'string'
      && typeof newName === 'string'
      && typeof newPassword === 'string') {
      this.userService.checkMail(newEmail).subscribe({
        next: (user) => {
          if (user) {
            alert(
              "Hallo, du bist schon mit mit dieser Mailadresse registriert!"
            );
          } 
        },
        error: (err) => {
          console.log(err.error.message)
          this.userService.createUser(newName, newEmail, newPassword).subscribe({
            next: (user) => {
              console.log('Erfolgreich registriert:', user);
              alert("Willkommen!")
              this.router.navigate(['/login'])
            },
            error: (err) => {
              console.log('Fehler bei der Registrierung:', err.status, err.error);
              alert("Fehler bei der Registrierung.")
            }
          });
        }
      });
    } else {
      alert("Wrong Input. Check the Notices!");
    }
  }
};
