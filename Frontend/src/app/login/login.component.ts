import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { emailDomainValidator } from '../validators/mail.validator';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, emailDomainValidator]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
  });

  userService = inject(UserService);
  router = inject(Router);

  handleSubmit() {
    const userMail = this.userForm.value.email;
    const userPW = this.userForm.value.password;
    if (typeof userMail === 'string' && typeof userPW === 'string' && userMail !== undefined) {
      this.userService.checkLogin(userMail, userPW).subscribe({
        next: (user) => {
          if (user !== undefined) {
            console.log("User:" + user.username + user.email);
            alert(
              "Hallo " + user.username + "!"
            );
            // Zur ToDo-Seite navigieren:
            this.router.navigate(['/sections']);
          }
        },
        error: (err) => {
          alert(err.error.message)
        }
      });
    } else {
      alert(
        this.userForm.value.email + ' | ' + this.userForm.value.password + " ist nicht gültig!");
    }

  }
}
