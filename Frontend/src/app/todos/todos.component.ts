import { Component, inject, signal, effect, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { PopupComponent } from '../components/popup/popup.component';
import { CommonModule } from '@angular/common';
import todoData from '../../assets/todos.json';
import { RouterModule } from '@angular/router';
import { SortFilterDropdownComponent } from '../components/sort-filter-dropdown/sort-filter-dropdown.component';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [PopupComponent, SortFilterDropdownComponent, CommonModule, HighlightDoneTodosDirective, RouterModule],
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
  actualFilter: string = '';

  openPopup(title: string, text: string) {
    this.popup.open(title, text);
  }

  openEdit(title: string, id: Todo) {
    this.popup.openEdit(title, id);
  }

  onPopupClosed() {
    this.arrayTodos = this.todoService.loadTodos();
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


  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    localStorage.setItem('todos', JSON.stringify(this.arrayTodos));
  }

  deleteTodo(todoID: number) {
    this.todoService.deleteTodo(todoID);
    this.arrayTodos = this.todoService.loadTodos();
  }

  onSort(sort: string) {
    this.arrayTodos = this.todoService.sortBy(sort as keyof Todo);
    return this.actualSort;
  }
  onFilter(filter: string) {
    this.arrayTodos = this.todoService.filterBy(filter);
    return this.actualFilter;
  }
}
