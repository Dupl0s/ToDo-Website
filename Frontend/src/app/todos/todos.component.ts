import { Component, inject, signal, effect, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import { TodoitemComponent } from '../components/todoitem/todoitem.component';
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { PopupComponent } from '../components/popup/popup.component';
import { CommonModule } from '@angular/common';
import todoData from '../../assets/todos.json';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [PopupComponent, CommonModule, HighlightDoneTodosDirective, RouterModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent {
  @ViewChild(PopupComponent) popup!: PopupComponent;

  todos = signal<Array<Todo>>(
    JSON.parse(localStorage.getItem('todos') || '[]')
  );

  todoService = inject(TodoService);
  arrayTodos: Todo[] = [];

  actualSort: string = '';

  openPopup(title: string, text: string) {
    this.popup.open(title, text, 'default');
  }
  
  openEdit(title: string, id: Todo) {
    this.popup.openEdit(title, id);
  }

  onPopupClosed() {
    this.arrayTodos = this.todoService.loadTodos();
    this.popup.isOpen.set(false);
    console.log('Popup wurde geschlossen');
  }

  ngOnInit() {
    this.arrayTodos = this.todoService.loadTodos();
    this.todoService.connectBackend().subscribe((data) => console.log(data.message));
  }

  sortedTodos() {
    return this.arrayTodos
      .slice()
      .sort((a, b) => Number(a.completed) - Number(b.completed));
  }

  sortDeadline() {
    this.arrayTodos.sort((a, b) => Date.parse(a.deadline).valueOf() - Date.parse(b.deadline).valueOf())
    localStorage.setItem('todos', JSON.stringify(this.arrayTodos));
    this.actualSort = "Deadline"
    return this.arrayTodos;

  }
  sortSchwierig() {
    this.arrayTodos.sort((a, b) => a.niveau - b.niveau);
    localStorage.setItem('todos', JSON.stringify(this.arrayTodos));
    this.actualSort = "Schwierigkeit"
    return this.arrayTodos;
  }

  sortPrio() {
    this.arrayTodos.sort((a, b) => a.importance - b.importance);
    localStorage.setItem('todos', JSON.stringify(this.arrayTodos));
    this.actualSort = "Priorität"
    return this.arrayTodos;
  }


  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    localStorage.setItem('todos', JSON.stringify(this.arrayTodos));
  }

  deleteTodo(todoID: number) {
    this.todoService.deleteTodo(todoID);
    this.arrayTodos = this.todoService.loadTodos();
  }

  onReminderClosed(): void {

    console.log('Reminder wurde geschlossen');}
}
