import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { PopupComponent } from '../components/popup/popup.component';
import {Bereich} from '../model/categories.type';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, PopupComponent],
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

  constructor(private router: Router) {
    const saved = localStorage.getItem('bereiche');
    this.bereiche = saved
      ? JSON.parse(saved)
      : [
          { id: 0, name: 'Exam' },
          { id: 1, name: 'Projekt' },
          { id: 2, name: 'Arbeit' },
          { id: 3, name: 'Einkaufen' }
        ];
  }

  addBereiche() {
    if (this.newBereich.trim()) {
      const newId =
        this.bereiche.length > 0
          ? Math.max(...this.bereiche.map(b => b.id)) + 1
          : 1;
      this.bereiche.push({ id: newId, name: this.newBereich.trim() });
      localStorage.setItem('bereiche', JSON.stringify(this.bereiche));
      this.newBereich = '';
    }
  }

  goToTodos(bereichId: number) {
    this.router.navigate(['/todos', bereichId]);
  }

  deletedCategories(id: number){
    this.bereiche= this.bereiche.filter((bereich)=>bereich.id!==id);
    localStorage.setItem('bereiche', JSON.stringify(this.bereiche));
  }

  editCategories(updatedBereich: Bereich){
    this.popup.openBereichEdit('Bereich bearbeiten', updatedBereich);

  }

  handleBereichEdit(updatedBereich: Bereich){
    const index = this.bereiche.findIndex(b => b.id === updatedBereich.id);
    if (index !== -1) {
      this.bereiche[index].name = updatedBereich.name.trim();
      localStorage.setItem('bereiche', JSON.stringify(this.bereiche));
    }
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


}