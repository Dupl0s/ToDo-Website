import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { emailDomainValidator } from '../validators/mail.validator';
import { User } from '../model/user.type';

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  user?: User | null;
  constructor(private userService: UserService, private router: Router) {
    this.userService.user.subscribe(x => {
      console.log('User aus Service:', x?.username);
      this.user = x
    })
  }

  editForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email, emailDomainValidator]),
    password: new FormControl('', [Validators.minLength(8)])
  });

  handleSubmit() {
    console.log("User: " + this.user?.userId)
    const newEmail = this.editForm.value.email;
    const newName = this.editForm.value.name;
    const newPassword = this.editForm.value.password;
    const updateData: Partial<User> = {};
    if (newEmail) updateData.email = newEmail;
    if (newName) updateData.username = newName;
    if (newPassword) updateData.password = newPassword;
    if (this.user) {
      this.userService.updateUser(String(this.user.userId), updateData).subscribe({
        next: (response) => {
          this.userService.updateLocalUser(response.user);
          alert(
            response.user.username + " geupdatet!"
          );
        },
        error: err => alert('Fehler beim Update: ' + err.error?.message)
      });
    }
  }
  delete() {
    if (this.user){
      /* TODO: popup: are you sure? */
      this.userService.delete(this.user.userId).subscribe({
        next: (response) => {
          alert(response)
          this.router.navigate(['/'])
        },
        error:err => alert(err),
      })
    }
  }
}

