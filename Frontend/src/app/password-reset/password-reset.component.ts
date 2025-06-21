import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../model/user.type';

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {
  passwordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

userService = inject(UserService);

handleSubmit() {
  if(typeof this.passwordForm.value.email === 'string'){
    const user: User | null = this.userService
    .resetPassword(this.passwordForm.value.email
    )
    if(user){
      alert("Wir haben dir eine Email an" + this.passwordForm.value.email + "geschickt.")
    }
    else{
      alert("Kein Konto mit dieser Mailadresse gefunden. Willst du ein neues Konto erstellen?")
    }
  }
}

}
