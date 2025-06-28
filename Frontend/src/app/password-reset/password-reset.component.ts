import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../model/user.type';
import { Router, RouterModule } from '@angular/router';
import { emailDomainValidator } from '../validators/mail.validator';

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {
  passwordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, emailDomainValidator])
  })

  userService = inject(UserService);
  router = inject(Router);

  handleSubmit() {
    const email = this.passwordForm.value.email;
    console.log("Sending password reset for:", email);
    if (typeof email === 'string'
      && email != undefined
      && email != null) {
      this.userService.resetPassword(email).subscribe({
        next: (user: User | null) => {
          {
            alert("Wir haben dir eine Email an: " + email + " geschickt.")
          }
          this.router.navigate(['/login'])

        },
        error: (err) => {
          console.log(err);
          if (err.status === 404) {
            alert(err.error.status + "Kein Konto mit dieser Mailadresse gefunden. Willst du ein neues Konto erstellen?");
          } else if (err.status === 400) {
            alert(err.error.status + "Ungültige Eingabe. Bitte überprüfe deine Email-Adresse.");
          } else {
            alert(err.error.status + "Ein unbekannter Fehler ist aufgetreten.");
          }
        }
      })
    }
    else {
      alert("Falsche Eingabedaten!")
    }
  }
}
