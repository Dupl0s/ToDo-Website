import { Component, inject, Output, signal, viewChild, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { PopupComponent } from '../components/popup/popup.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { SortFilterDropdownComponent } from '../components/sort-filter-dropdown/sort-filter-dropdown.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [PopupComponent, SortFilterDropdownComponent, CommonModule, HighlightDoneTodosDirective, RouterModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent {
  @ViewChild(PopupComponent) popup!: PopupComponent;

  todoService = inject(TodoService);
  arrayTodos: Todo[] = [];
  actualSort: string = '';
  bereichsId: number | null = null;
  actualFilter: string = '';
  ascending: boolean = false;
  dateFrom: string = '';
  dateTo: string = '';
  bereichName = '';
  todosBackend: any;
  bereichId: number | null = null;

  justCompletedId: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    public http: HttpClient
  ) {}

  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService) { }

  openPopup(title: string, text: string) {
    this.popup.open(title, text, 'default');
  }

  openEdit(title: string, id: Todo) {
    this.popup.open(title, '', 'editTodo', undefined, id);
  }

  onPopupClosed() {
    this.applyFilterandSort();
    console.log('Popup wurde geschlossen');
  }

  ngOnInit() {
/*     this.arrayTodos = this.todoService.loadTodos();
 */    
  this.todoService.connectBackend().subscribe((data) => console.log(data.message));

      if (this.bereichsId !== null) {
        const bereich = this.categoriesService
          .getBereiche()
          .find((b) => b.id === this.bereichsId);
        this.bereichName = bereich ? bereich.name : 'Unbekannter Bereich';
      }

      this.applyFilterandSort();
      this.popup.checkForReminders();
    });
  }

    this.applyFilterandSort();
    this.popup.checkForReminders();

  });
  }
  
  
  //Asking the method to createTask to take the Todo without the bereichsId(as it is not manually filled in by the user) and setting the bereichsid ourselves from above.
  createTask(taskData: Omit<Todo, 'bereichsId'>) {
    const newTask = {
      ...taskData,
      bereichsId: this.bereichsId!,
    };
    console.log('New task received from popup:', newTask);
    // Todo: POST-Request an die API senden
    this.http
      .post<Todo>(
        'https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos',
        newTask
      )
      .subscribe(() => {
        // Nach dem Hinzufügen neu laden
        this.refreshTodosFromApi();
      });
  }

  toggleCompleted(todo: Todo) {
    // Todo: PUT-Request an die API senden, um den Status zu ändern
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.http
      .put<Todo>(
        `https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${todo.id}`,
        updatedTodo
      )
      .subscribe(() => {
        this.refreshTodosFromApi();
      });
  }

  deleteTodo(todoID: number) {
    this.http
      .delete(
        `https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${todoID}`
      )
      .subscribe(() => {
        this.refreshTodosFromApi();
      });
  }

  refreshTodosFromApi() {
    this.http
      .get<{ todos: Todo[] }>(
        'https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos'
      )
      .subscribe((response) => {
        this.arrayTodos = response.todos;
        localStorage.setItem('todos', JSON.stringify(response.todos));
        this.applyFilterandSort();
      });
  }

  onSort(sort: string | { from: string; to: string }) {
    if (typeof sort === 'string' && sort === '') {
      this.actualSort = '';
    } else {
      this.actualSort = sort as string;
    }
    this.applyFilterandSort();
  }

  onReminderClosed(): void {
    console.log('Reminder wurde geschlossen');
  }

  onFilter(filter: string | { from: string; to: string }) {
    if (typeof filter === 'string' && filter === '') {
      this.actualFilter = '';
      this.dateFrom = '';
      this.dateTo = '';
    } else if (typeof filter === 'object' && filter.from && filter.to) {
      this.actualFilter = 'date-range';
      this.dateFrom = filter.from;
      this.dateTo = filter.to;
    } else {
      this.actualFilter = filter as string;
    }
    this.applyFilterandSort();
  }


  applyFilterandSort() {
    let todos = [...this.arrayTodos];
    if (this.bereichsId !== null) {
      todos = todos.filter((todo) => todo.bereichsId === this.bereichsId);
    }
    if (this.actualFilter === 'true' || this.actualFilter === 'false') {
      todos = this.todoService.filterBy(this.actualFilter, todos);
    } else if (
      this.actualFilter === 'date-range' &&
      this.dateFrom != '' &&
      this.dateTo != ''
    ) {
      todos = this.todoService.filterByDateRange(
        this.dateFrom,
        this.dateTo,
        todos
      );
    }
    if (this.actualSort != '') {
      todos = this.todoService.sortBy(
        this.actualSort as keyof Todo,
        this.ascending,
        todos
      );
    } else if (this.actualSort === '') {
      console.log('no sort, default');
      this.actualSort = 'completed';
      this.ascending = true;
      todos = this.todoService.sortBy(
        this.actualSort as keyof Todo,
        this.ascending,
        todos
      );
    }

    return (this.arrayTodos = todos);
  }

  getBool(ascend: boolean) {
    this.ascending = ascend;
    this.applyFilterandSort();
  }
}
