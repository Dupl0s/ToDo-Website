import { Component, EventEmitter, Output, signal } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../model/todo.type';
import { TodoService } from '../../services/todo.service';
import todoData from '../../../assets/todos.json';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
})
export class PopupComponent {
  constructor(private todoService: TodoService) {}
  editMode = false;
  currentID = 0; //overwritten by ID of clicked ToDo
  currentUserID = 0; //overwritten by userID of Todo
  index = {};

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

  @Output() todoSaved = new EventEmitter<Todo>();
  @Output()
  @Output()
  closed = new EventEmitter<void>();

  open(title: string, message: string, mode: string) {
    this.title.set(title);
    this.message.set(message);
    this.isOpen.set(true);
    this.mode.set(mode);
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
    if (this.editMode) {
      const updatedTodo: Todo = {
        id: this.currentID,
        userId: this.currentUserID,
        completed: false,
        title: this.title2(),
        deadline: this.deadline(),
        niveau: this.niveau(),
        importance: this.importance(),
        bereichsId: 1,
      };
      this.todoService.editTodo(updatedTodo);
    } else {
      const newTodo: Todo = {
        id: Date.now(),
        userId: 1,
        completed: false,
        title: this.title2(),
        deadline: this.deadline(),
        niveau: this.niveau(),
        importance: this.importance(),
        bereichsId: 1,
      };

      this.todoService.addTodo(newTodo);
    }

    this.close();
  }

  ngOnInit() {
    this.checkForReminders();
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
}
