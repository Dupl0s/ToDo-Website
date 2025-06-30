import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../model/todo.type';
import { TodoService } from '../../services/todo.service';
import { Bereich } from '../../model/categories.type';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
})
export class PopupComponent {
  constructor(
    private todoService: TodoService,
    private categoryService: CategoriesService
  ) {}
  editMode = false;
  editBereichMode = false;
  currentID = 0;
  currentUserID = 0;
  currentBereichsId = 0;
  bereichName = signal('');

  isOpen = signal(false);
  title = signal('');
  message = signal('');
  time = signal('');
  todos = signal<Array<Todo>>(
    JSON.parse(localStorage.getItem('todos') || '[]')
  );
  mode = signal(''); //the mode of the popup, e.g. 'reminder', 'edit', etc.

  title2 = signal('');
  niveau = signal(1);
  importance = signal(1);
  deadline = signal('');

  @Output() closed = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<Omit<Todo, 'bereichsId'>>();
  @Output() bereichEdited = new EventEmitter<{ id: number; name: string }>();

  ngOnInit() {
    this.checkForReminders();}

  openBereichEdit(title: string, bereich: Bereich) {
    this.title.set(title);
    this.isOpen.set(true);
    this.editMode = false;
    this.editBereichMode = true;
   
  }

  open(title: string, message: string, mode: string, bereich?: Bereich, todo?: Todo) {
    this.title.set(title);
    this.message.set(message);
    this.isOpen.set(true);
    this.mode.set(mode);
    console.log('Popup opened with mode:', mode);

    if (bereich) {
      this.bereichName.set(bereich.name);
      this.currentBereichsId = bereich.id;
      this.bereichName.set(bereich.name);
    }
    if(todo){
      this.title2.set(todo.title);
      this.deadline.set(todo.deadline);
      this.importance.set(todo.importance);
      this.niveau.set(todo.niveau);
      this.currentID = todo.id;
      this.currentUserID = todo.userId;
    }
  }

  openEdit(title: string, item: Todo) {
    this.title.set(title);
    this.isOpen.set(true);
    this.editMode = true;

    this.title2.set(item.title);
    this.deadline.set(item.deadline);
    this.importance.set(item.importance);
    this.niveau.set(item.niveau);
    this.currentID = item.id;
    this.currentUserID = item.userId;
  }

  close() {
    this.isOpen.set(false);
    this.closed.emit();
    this.editMode = false;
  }

  save() {
    console.log('Save clicked');
    if (this.mode() === 'editBereich') {
      const updateName = this.bereichName().trim();
      if (updateName) {
        this.categoryService.handleUpdate({
          id: this.currentBereichsId,
          name: updateName,
        });
        this.bereichEdited.emit({
          id: this.currentBereichsId,
          name: updateName,
        });
      }
    }
    if (this.mode() === 'default') {
      const id = bereichId(this.bereichName());
      const todo: Todo = {
        id: Date.now(),
        bereichsId: id,
        userId: 1,
        completed: false,
        title: this.title2(),
        deadline: this.deadline(),
        niveau: this.niveau(),
        importance: this.importance(),
      };

      this.todoService.addTodo(todo);
      this.taskCreated.emit({
        id: todo.id,
        userId: todo.userId,
        completed: todo.completed,
        title: todo.title,
        deadline: todo.deadline,
        niveau: todo.niveau,
        importance: todo.importance,
      });
    }
    if(this.mode() === 'editTodo') {
      const id = bereichId(this.bereichName());
      const updatedTodo: Todo = {
        id: this.currentID,
        userId: this.currentUserID,
        bereichsId: id,
        completed: false,
        title: this.title2(),
        deadline: this.deadline(),
        niveau: this.niveau(),
        importance: this.importance(),
      };
      this.todoService.editTodo(updatedTodo);
    }
    this.close();
  }
  checkForReminders() {
    const todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const reminders = todos.filter((todo) => {
      if (!todo.deadline) return false;
      const deadline = new Date(todo.deadline);
      deadline.setHours(23, 59, 59, 999);
      return !todo.completed && deadline <= tomorrow;
    });
    if (reminders.length > 0) {
      this.open(
        'Erinnerung',
        `Du hast ${reminders.length} unerledigte ToDos, die fällig sind!`,
        'reminder'
      );
    }
  }

  get bereichNameModel() {
    return this.bereichName();
  }
  set bereichNameModel(val: string) {
    this.bereichName.set(val);
  }
}
function bereichId(arg0: string): any {
  const url = new URL(arg0, window.location.href);
  const segments = url.pathname.split('/');
  const bereichId = segments[segments.length - 1];
  return parseInt(bereichId, 10);
}

