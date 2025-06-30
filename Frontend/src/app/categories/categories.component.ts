/*import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Popover } from 'bootstrap';
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
  private popover?:Popover;

  get currentBereich(): Bereich | null {
    return this.bereiche.length > 0 ? this.bereiche[this.currentIndex] : null;
  }

  constructor(private router: Router, private categoriesService: CategoriesService, private todoService:TodoService){
    this.bereiche=this.categoriesService.getBereiche();
  }

  addBereiche(button: ElementRef| HTMLElement) {
    const btn= button instanceof ElementRef? button.nativeElement: button;
    if (this.newBereich.trim()) {
      this.categoriesService.addBereich(this.newBereich.trim());
      this.newBereich = '';
      this.bereiche=this.categoriesService.getBereiche();
    
    this.popover= new Popover(btn,{
      trigger: 'manual',
      title: 'Bereich hinzugefügt!',
      content: 'Ihr Bereich wurde erfolgreich erstellt',
      placement: 'right',
      customClass:'popover',
    });
    this.popover.show();
    setTimeout(()=> this.popover?.hide(),3000);
  }
}

  goToTodos(bereichId: number) {
    this.router.navigate(['/todos', bereichId]);
  }

  editCategories(updatedBereich: Bereich){
    //this.popup.openBereichEdit('Bereich bearbeiten', updatedBereich);
    this.popup.open('Bereich bearbeiten', '', 'editBereich', updatedBereich);

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

 deletedCategories(bereichId: number, button: HTMLElement) {
  const todos = this.todoService.loadTodos();
  const todosExist = todos.some(todo => todo.bereichsId === bereichId);

  if (todosExist) {
    this.showDeletePopover(button, bereichId);
  } else {
    this.categoriesService.deleteBereich(bereichId);
    this.todoService.deleteTodosByBereichsId(bereichId);
    this.bereiche = this.categoriesService.getBereiche();
  }
}

showDeletePopover(button: HTMLElement, bereichId: number) {
  if (this.popover) {
    this.popover.dispose();
  }

  // Content for the showPopover with HTML inside for the buttons
  const content = document.createElement('div');
  content.innerHTML = `
    <p>Dieser Bereich enthält Todos. Möchten Sie trotzdem löschen?</p>
    <div class="d-flex justify-content-end gap-2 mt-2">
      <button id="confirmDelete" class="btn btn-sm btn-danger">Löschen trotzdem</button>
      <button id="cancelDelete" class="btn btn-sm btn-secondary">Abbrechen</button>
    </div>
  `;

  //Defininf the popover
  this.popover = new Popover(button, {
    title: 'Bereich löschen?',
    content,
    html: true,
    trigger: 'manual',
    placement: 'right',
    customClass: 'popover',
  });

  this.popover.show();

  // Use setTimeout to ensure DOM insertion
  setTimeout(() => {
    const confirmBtn = document.getElementById('confirmDelete');
    const cancelBtn = document.getElementById('cancelDelete');

    confirmBtn?.addEventListener('click', () => {
      this.categoriesService.deleteBereich(bereichId);
      this.todoService.deleteTodosByBereichsId(bereichId);
      this.bereiche = this.categoriesService.getBereiche();
      this.popover?.hide();
    });

    cancelBtn?.addEventListener('click', () => {
      this.popover?.hide();
    });
  });
}

}*/
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Popover } from 'bootstrap';
import { PopupComponent } from '../components/popup/popup.component';
import { Bereich } from '../model/categories.type';
import { CategoriesService } from '../services/categories.service';
import { RouterModule } from '@angular/router';
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
  private popover?: Popover;

  get currentBereich(): Bereich | null {
    return this.bereiche.length > 0 ? this.bereiche[this.currentIndex] : null;
  }

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private todoService: TodoService
  ) {
    this.loadBereiche();
  }

  loadBereiche() {
    this.categoriesService.getBereiche().subscribe(bereiche => {
      this.bereiche = bereiche;
    });
  }

  addBereiche(button: ElementRef | HTMLElement) {
    const btn = button instanceof ElementRef ? button.nativeElement : button;
    if (this.newBereich.trim()) {
      this.categoriesService.addBereich(this.newBereich.trim()).subscribe((newBereich) => {
        this.bereiche.push(newBereich);
        this.newBereich = '';
  
        this.popover = new Popover(btn, {
          trigger: 'manual',
          title: 'Bereich hinzugefügt!',
          content: 'Ihr Bereich wurde erfolgreich erstellt',
          placement: 'right',
          customClass: 'popover',
        });
        this.popover.show();
        setTimeout(() => this.popover?.hide(), 3000);
      });
    }
  }

  goToTodos(bereichId: number) {
    this.router.navigate(['/todos', bereichId]);
  }

  editCategories(updatedBereich: Bereich) {
    this.popup.openBereichEdit('Bereich bearbeiten', updatedBereich);
  }

  handleBereichEdit(updatedBereich: Bereich) {
    this.categoriesService.handleUpdate(updatedBereich).subscribe(() => {
      this.loadBereiche();
    });
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

  deletedCategories(bereichId: number, button: HTMLElement) {
    const todos = this.todoService.loadTodos();
    const todosExist = todos.some(todo => todo.bereichsId === bereichId);

    if (todosExist) {
      this.showDeletePopover(button, bereichId);
    } else {
      this.categoriesService.deleteBereich(bereichId).subscribe(() => {
        this.todoService.deleteTodosByBereichsId(bereichId);
        this.loadBereiche();
      });
    }
  }

  showDeletePopover(button: HTMLElement, bereichId: number) {
    if (this.popover) {
      this.popover.dispose();
    }

    const content = document.createElement('div');
    content.innerHTML = `
      <p>Dieser Bereich enthält Todos. Möchten Sie trotzdem löschen?</p>
      <div class="d-flex justify-content-end gap-2 mt-2">
        <button id="confirmDelete" class="btn btn-sm btn-danger">Löschen trotzdem</button>
        <button id="cancelDelete" class="btn btn-sm btn-secondary">Abbrechen</button>
      </div>
    `;

    this.popover = new Popover(button, {
      title: 'Bereich löschen?',
      content,
      html: true,
      trigger: 'manual',
      placement: 'right',
      customClass: 'popover',
    });

    this.popover.show();

    setTimeout(() => {
      const confirmBtn = document.getElementById('confirmDelete');
      const cancelBtn = document.getElementById('cancelDelete');

      confirmBtn?.addEventListener('click', () => {
        this.categoriesService.deleteBereich(bereichId).subscribe(() => {
          this.todoService.deleteTodosByBereichsId(bereichId);
          this.loadBereiche();
          this.popover?.hide();
        });
      });

      cancelBtn?.addEventListener('click', () => {
        this.popover?.hide();
      });
    });
  }
}
