import { Component, inject, Output, signal, viewChild, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { PopupComponent } from '../components/popup/popup.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { SortFilterDropdownComponent } from '../components/sort-filter-dropdown/sort-filter-dropdown.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../model/user.type';
import { UserService } from '../services/user.service';

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
  filteredTodos: Todo[] = [];
  testArray: Todo[] = [];
  userId: String = "";
  user?: User | null;
  UserService = inject(UserService);

  justCompletedId: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    public http: HttpClient,
  ) {
    this.UserService.user.subscribe((user) => {
      this.user = user;
    });
  }



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
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.bereichsId = id ? Number(id) : null;

      if (this.bereichsId !== null) {
        this.categoriesService.getBereiche(String(this.user?.userId)).subscribe((bereiche) => {
          const bereich = bereiche.find((b) => b.id === this.bereichsId);
          this.bereichName = bereich ? bereich.name : 'Unbekannter Bereich';
        });
        // Todos für den spezifischen Bereich laden
        this.refreshTodosFromApi(this.bereichsId);
      } else {
        // Alle Todos laden, wenn keine bereichsId vorhanden
        this.refreshTodosFromApi();
      }

      //this.popup.checkForReminders();
    });
  }

  //Asking the method to createTask to take the Todo without the bereichsId(as it is not manually filled in by the user) and setting the bereichsid ourselves from above.
  createTask(taskData: Omit<Todo, 'bereichsId'>) {
    const newTask = {
      ...taskData,
      userID: this.user?.userId || "1", // Backend erwartet userID
      bereichsID: this.bereichsId!, // Backend erwartet bereichsID (nicht bereichsId)
    };
    console.log('New task received from popup:', newTask);
    // Todo: POST-Request an die API senden
    this.http
      .post<Todo>(
        'https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos',
        newTask
      )
      .subscribe({
        next: (response) => {
          console.log('Todo created successfully:', response);
          // Nach dem Hinzufügen neu laden
          this.refreshTodosFromApi();
        },
        error: (error) => {
          console.error('Error creating todo:', error);
        }
      });
  }

  toggleCompleted(todo: Todo) {
/* für Popover, wenn erledigt: */
    if (!todo.completed) {
      this.justCompletedId = todo.id;
      console.log('justCompletedId gesetzt:', this.justCompletedId);
      setTimeout(() => {
        this.justCompletedId = null;
      }, 2000);
    } else {
      this.justCompletedId = null;
      console.log('justCompletedId zurückgesetzt');
    }
    // Todo: PUT-Request an die API senden, um den Status zu ändern
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.http
      .put<Todo>(
        `https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${todo.id}`,
        updatedTodo
      )
      .subscribe(() => {
        this.refreshTodosFromApi();
        this.todoService.refreshCurrentRoute();
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

  refreshTodosFromApi(bereichId?: number) {
    if (bereichId) {
      this.bereichsId = bereichId;

      // Query Parameters für UserID hinzufügen
      const params = new HttpParams().set('userId', (this.user?.userId ?? '').toString());


      this.http
        .get<{ todos: Todo[] }>(
          `https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${bereichId}`,
          { params }
        )
        .subscribe({
          next: (response) => {
            this.arrayTodos = Array.isArray(response.todos) ? response.todos : [];
            this.applyFilterandSort();
          },
          error: () => {
            const local = localStorage.getItem('todos');
            let arr = local ? JSON.parse(local) : [];
            this.arrayTodos = Array.isArray(arr) ? arr.filter((todo: Todo) => todo.bereichsID === bereichId) : [];
            this.applyFilterandSort();
          },
        });
    } else {
      this.bereichsId = null;

      // Query Parameters für UserID hinzufügen
      const params = new HttpParams().set('userId', (this.user?.userId ?? '').toString());


      this.http
        .get<{ todos: Todo[] }>(
          'https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos',
          { params }
        )
        .subscribe({
          next: (response) => {
            this.arrayTodos = Array.isArray(response.todos) ? response.todos : [];
            this.applyFilterandSort();
          },
          error: () => {
            const local = localStorage.getItem('todos');
            let arr = local ? JSON.parse(local) : [];
            this.arrayTodos = Array.isArray(arr) ? arr : [];
            this.applyFilterandSort();
          },
        });
    }
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
    // Backend filtert bereits nach bereichsID, keine zusätzliche Filterung nötig

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
      this.actualSort = 'completed';
      this.ascending = true;
      todos = this.todoService.sortBy(
        this.actualSort as keyof Todo,
        this.ascending,
        todos
      );
    }

    this.filteredTodos = todos;
  }

  getBool(ascend: boolean) {
    this.ascending = ascend;
    this.applyFilterandSort();
  }

  loadTodosByBereichId(bereichsId: number): void {
    console.log('Lade Todos für Bereichs-ID:', bereichsId);

    // Query Parameters für UserID hinzufügen
    const params = new HttpParams().set('userId', (this.user?.userId ?? '').toString());

    this.http
      .get<{ todos: Todo[] }>(
        `https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${bereichsId}`,
        { params }
      )
      .subscribe({
        next: (response) => {
          this.arrayTodos = Array.isArray(response.todos) ? response.todos : [];
          localStorage.setItem('todos', JSON.stringify(this.arrayTodos));
          this.applyFilterandSort();
        },
        error: () => {
          // Fallback: LocalStorage
          const local = localStorage.getItem('todos');
          let arr = local ? JSON.parse(local) : [];
          this.arrayTodos = Array.isArray(arr) ? arr.filter((todo: Todo) => todo.bereichsID === bereichsId) : [];
          this.applyFilterandSort();
        }
      });
  }
}
