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
  ascending: boolean = false;
  dateFrom: string = '';
  dateTo: string = '';

  openPopup(title: string, text: string) {
    this.popup.open(title, text);
  }

  openEdit(title: string, id: Todo) {
    this.popup.openEdit(title, id);
  }

  onPopupClosed() {
/*     this.arrayTodos = this.todoService.loadTodos();
 */    this.applyFilterandSort();
    console.log('Popup wurde geschlossen');
  }

  ngOnInit() {
/*     this.arrayTodos = this.todoService.loadTodos();
 */    this.applyFilterandSort();
    console.log("ngOninit")
    this.todoService.connectBackend().subscribe((data) => console.log(data.message));
  }

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    localStorage.setItem('todos', JSON.stringify(this.arrayTodos));
  }

  deleteTodo(todoID: number) {
    this.todoService.deleteTodo(todoID);
    this.applyFilterandSort();
/*     this.arrayTodos = this.todoService.loadTodos();
 */  }

  onSort(sort: string | { from: string, to: string }) {
    if (typeof sort === 'string' && sort === '') {
      this.actualSort = '';
    }
    else {
      this.actualSort = sort as string;
    }
    this.applyFilterandSort();
  }

  onFilter(filter: string | { from: string, to: string }) {

    if (typeof filter === 'string' && filter === '') {
      this.actualFilter = '';
      this.dateFrom = '';
      this.dateTo = '';
    }
    else if (typeof filter === 'object' && filter.from && filter.to) {
      this.actualFilter = 'date-range';
      this.dateFrom = filter.from;
      this.dateTo = filter.to;
    }
    else {
      this.actualFilter = filter as string;
    }
    this.applyFilterandSort()
  }

  applyFilterandSort() {
    let todos = this.todoService.loadTodos();
    if (this.actualFilter === 'true' || this.actualFilter === 'false') {
      todos = this.todoService.filterBy(this.actualFilter, todos);
    }
    else if (this.actualFilter === 'date-range' && this.dateFrom != '' && this.dateTo != '') {
      todos = this.todoService.filterByDateRange(this.dateFrom, this.dateTo, todos);
    }
    if (this.actualSort != '') {
      todos = this.todoService.sortBy(this.actualSort as keyof Todo, this.ascending, todos);
    }
    else if (this.actualSort === '') {
      console.log("no sort, default")
      this.actualSort = 'completed';
      this.ascending = true;
      todos = this.todoService.sortBy(this.actualSort as keyof Todo, this.ascending, todos);
    }

    return this.arrayTodos = todos;
  }

  getBool(ascend: boolean) {
    this.ascending = ascend;
    this.applyFilterandSort();
  }
}
