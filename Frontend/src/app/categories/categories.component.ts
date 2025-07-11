import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Popover } from 'bootstrap';
import { PopupComponent } from '../components/popup/popup.component';
import { Bereich } from '../model/categories.type';
import { CategoriesService } from '../services/categories.service';
import { TodoService } from '../services/todo.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodosComponent } from '../todos/todos.component';
import { User } from '../model/user.type';
import { UserService } from '../services/user.service';

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
  @ViewChild(TodosComponent) TodosComponent!: TodosComponent;

  get currentBereich(): Bereich | null {
    return this.bereiche.length > 0 ? this.bereiche[this.currentIndex] : null;
  }
  user?: User | null;
  userService = inject(UserService);

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private todoService: TodoService
  ) {
    this.userService.user.subscribe(x => this.user = x);
    this.loadBereiche();
  }

  loadBereiche() {
    if (this.user?.userId != undefined) {
      console.log(this.user.userId)
    this.categoriesService.getBereiche(String(this.user?.userId)).subscribe(data => {
      this.bereiche = data;
          });
    }
    if (!this.user?.userId === undefined) {
      alert("Error with Userid")
      console.log("Error with Userid")
    }

  }

  addBereiche(button: ElementRef | HTMLElement) {
    const btn = button instanceof ElementRef ? button.nativeElement : button;
    const userid = this.user?.userId;
    console.log(userid);
    if (this.newBereich.trim()) {
      this.categoriesService.addBereich(this.newBereich.trim(), String(userid)).subscribe((newBereich) => {
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
    this.TodosComponent.loadTodosByBereichId(bereichId);
  }

  editCategories(updatedBereich: Bereich) {
    this.popup.open('Bereich bearbeiten', '', 'editBereich', updatedBereich);
  }

  handleBereichEdit(updatedBereich: Bereich) {
    this.categoriesService.handleUpdate(updatedBereich).subscribe(() => {
      /*this.loadBereiche();*/
      const idx = this.bereiche.findIndex(b => b.id === updatedBereich.id);
      if (idx !== -1) {
        this.bereiche[idx] = updatedBereich;
      }
    });

  }

  prevSlide() {
    if (this.bereiche.length > 0) {
      this.currentIndex = Math.max(this.currentIndex - 3, 0);
    }
  }

  nextSlide() {
    if (this.bereiche.length > 0) {
      const maxIndex = this.bereiche.length - 3;
      this.currentIndex = Math.min(this.currentIndex + 3, maxIndex);

    }
  }

  deletedCategories(bereichId: number, button: HTMLElement) {
    const todos = this.todoService.loadTodos();
    const todosExist = todos.some(todo => todo.bereichsID === bereichId);

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
