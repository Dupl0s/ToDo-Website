import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../model/user.type';
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

/*   @Output() loggedIn = new EventEmitter<boolean>();
  logged: boolean = false; */

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
          if (user) {
            console.log("User:" + user.username + user.email);
            alert(
              "Hallo " + user.username + "!"
            );
            // Zur ToDo-Seite navigieren:
            this.router.navigate(['/todos']);
            /*ToDo: cache user data, load Todos */
          }

          else {
            this.userService.checkMail(userMail).subscribe((user: User | null) => {
              if (user) {
                alert("Falsches Passwort. Passwort vergessen?");
              } else {
                alert("Login fehlgeschlagen: Benutzer nicht gefunden oder ungültige Anmeldedaten!");
              }
            });
          }
        }
      });
    } else {
      alert(
        this.userForm.value.email + ' | ' + this.userForm.value.password + " ist nicht gültig!");
    }

  }
}
