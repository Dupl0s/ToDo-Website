import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})

export class CategoriesComponent {
  catForm!: FormGroup;
  categories: string[]=[];
  
  constructor(private fb: FormBuilder) {
    this.catForm=this.fb.group({
    name:['', [Validators.required, Validators.minLength(3)]]
    });
  }
  ngOnInit(): void {
    const savedCats = localStorage.getItem('categories');
    if (savedCats) {
      this.categories = JSON.parse(savedCats);
    }
  }
  addCategories(){
    if (this.catForm.valid){
      const name= this.catForm.value.name.trim();
      if (name && !this.categories.includes(name)){
        this.categories.push(name);
        this.catForm.reset();
      
        localStorage.setItem('categories', JSON.stringify(this.categories));

        const modalEl = document.getElementById('addCategoryModal');
        if (modalEl) {
          const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
          modal.hide();
        }
      }
    }
  }
}