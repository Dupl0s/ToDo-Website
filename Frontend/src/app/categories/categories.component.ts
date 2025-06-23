import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { PopupComponent } from '../components/popup/popup.component';
import {Bereich} from '../model/categories.type';
import { CategoriesService } from '../services/categories.service';
import {RouterModule} from '@angular/router';
import { TodoService } from '../services/todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, PopupComponent, RouterModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  bereiche: Bereich[] = [];
  newBereich = '';
  currentIndex = 0;

  @ViewChild(PopupComponent) popup!: PopupComponent;

  get currentBereich(): Bereich | null {
    return this.bereiche.length > 0 ? this.bereiche[this.currentIndex] : null;
  }

  constructor(private router: Router, private categoriesService: CategoriesService, private todoService:TodoService){
    this.bereiche=this.categoriesService.getBereiche();
  }

  addBereiche() {
    if (this.newBereich.trim()) {
      this.categoriesService.addBereich(this.newBereich.trim());
      this.newBereich = '';
      this.bereiche=this.categoriesService.getBereiche();
    }
  }

  goToTodos(bereichId: number) {
    this.router.navigate(['/todos', bereichId]);
  }

  /*deletedCategories(id: number){
    this.categoriesService.deleteBereich(id);
    this.bereiche= this.categoriesService.getBereiche();
  }*/

  editCategories(updatedBereich: Bereich){
    this.popup.openBereichEdit('Bereich bearbeiten', updatedBereich);

  }

  handleBereichEdit(updatedBereich: Bereich){
    this.categoriesService.handleUpdate(updatedBereich);    
    this.bereiche=this.categoriesService.getBereiche();
  }

  prevSlide() {
    if (this.bereiche.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.bereiche.length) % this.bereiche.length;
    }
  }
  
  nextSlide() {
    if (this.bereiche.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.bereiche.length;
    }
  }
deletedCategories(id: number){
  this.bereiche = this.bereiche.filter((bereich) => bereich.id !== id);
  localStorage.setItem('bereiche', JSON.stringify(this.bereiche));
  
  // Delete todos belonging to this Bereich as well
  this.todoService.deleteTodosByBereichsId(id);
}
}