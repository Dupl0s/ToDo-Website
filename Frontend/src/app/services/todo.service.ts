import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, viewChild } from '@angular/core';
import { Todo } from '../model/todo.type';
import { map, Observable, Subject } from 'rxjs';
import todoData from '../../assets/todos.json';
import { CategoriesService } from '../services/categories.service';
import { Bereich } from '../model/categories.type';
import { User } from '../model/user.type';
import { UserService } from './user.service';
import { TodosComponent } from '../todos/todos.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TodoService {

  userId: String = "";
  user?: User | null;
  UserService = inject(UserService);
  router = inject(Router);
  location = inject(Location);
  
  // Subject für Component-Communication
  private refreshTodosSubject = new Subject<number | undefined>();
  public refreshTodos$ = this.refreshTodosSubject.asObservable();
  
  private applyFilterSubject = new Subject<void>();
  public applyFilter$ = this.applyFilterSubject.asObservable();

  justCompletedId: number | null = null;
  constructor(
  ) {this.UserService.user.subscribe((user) => {
    this.user = user;
  });}
  
  http = inject(HttpClient);

  localTodos: Todo[] = [
    {
      id: 7,
      userId: 1,
      title: 'Beispiel Todo 1',
      completed: false,
      deadline: '2025-10-15',
      niveau: 3,
      importance: 5,
      bereichsID: 1,
    },
    {
      id: 8,
      userId: 1,
      title: 'Beispiel Todo 2',
      completed: true,
      deadline: '2025-11-20',
      niveau: 2,
      importance: 4,
      bereichsID: 1,
    },
    {
      id: 9,
      userId: 1,
      title: 'Beispiel Todo 3',
      completed: true,
      deadline: '2025-11-20',
      niveau: 2,
      importance: 4,
      bereichsID: 1,
    },
  ];
  todos = signal<Array<Todo>>([]
  );

  loadTodos(): Todo[] {
    /*this.http.get<Todo[]>('https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos')
      .subscribe((data) => { 
        this.localTodos = data;
        localStorage.setItem('todos', JSON.stringify(this.localTodos));
        this.todos.set(this.localTodos);
        console.log('Todos loaded from API:', this.localTodos);
      });
    return this.localTodos;*/
    return this.localTodos;
  }

  addTodo(newTodo: Todo) {
    // Backend-kompatible Struktur erstellen
    const todoForBackend = {
      ...newTodo,
      userID: this.user?.userId,
      bereichsID: newTodo.bereichsID
    };
    
    this.http.post<{ todo: Todo }>('https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos', todoForBackend)
      .subscribe({
        next: (response) => {
          console.log('Todo added:', response.todo);
          this.localTodos.push(response.todo);
          this.todos.set(this.localTodos);
          localStorage.setItem('todos', JSON.stringify(this.localTodos));
          
          // Router navigate um ngOnInit zu triggern
          this.refreshComponentWithBereichId(newTodo.bereichsID);
        },
        error: (error) => {
          console.error('Error adding todo:', error);
        }
      });
      
  }

  editTodo(updatedTodo: Todo) {
    this.http.put<Todo>(
      `https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${updatedTodo.id}`,
      updatedTodo
    ).subscribe((todo) => {
      // Optional: Nach dem Edit neu laden
      this.loadTodos();
      console.log('Todo updated:', todo);
      this.refreshCurrentRoute();
    });
  }

  dustbin = signal<Array<Todo>>(
    JSON.parse(localStorage.getItem('dustbin') || '[]')
  );


  deleteTodo(id: number) {
    this.http.delete(`https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${id}`)
      .subscribe({
        next: () => {
          console.log('Todo deleted successfully');
          this.refreshCurrentRoute();
        },
        error: (error) => {
          console.error('Error deleting todo:', error);
        }
      });
  }

  addToDustbin(todo: Todo) {
    const currentDustbin = this.dustbin();
    const updatedDustbin = [...currentDustbin, todo];
    this.dustbin.set(updatedDustbin);
    localStorage.setItem('dustbin', JSON.stringify(updatedDustbin));
  }

  getDustbin(): Todo[] {
    return this.dustbin();
  }
  deleteFromDustbin(id: number) {
    const updatedDustbin = this.dustbin().filter((todo) => todo.id !== id);
    this.dustbin.set(updatedDustbin);
    localStorage.setItem('dustbin', JSON.stringify(updatedDustbin));
  }

  sortBy<K extends keyof Todo>(key: K, ascending: boolean, todos?: Todo[]) {
    const allTodos = (todos ? todos : this.localTodos.slice());
    allTodos.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      // Wenn das Feld ein Datum ist, parse es als Zahl
      if (key === 'deadline') {
        const aDate = Date.parse(aValue as string);
        const bDate = Date.parse(bValue as string);
        if (isNaN(aDate) && isNaN(bDate))
          return 0;
        if (isNaN(aDate))
          return 1;
        if (isNaN(bDate))
          return -1;
        return ascending ? aDate - bDate : bDate - aDate;
      }

      /* für default completed: */
      if (key === 'completed') {
        return ascending ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      }
      /* für alphabetisch Klein Und Großschreibung nicht beachten */
      if (key === 'title' && typeof aValue === 'string' && typeof bValue === 'string') {
        return ascending ? aValue.toLowerCase().localeCompare(bValue.toLowerCase()) : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
      }
      if (aValue > bValue) return ascending ? -1 : 1;
      if (aValue < bValue) return ascending ? 1 : -1;

      return 0;
    });
/*     localStorage.setItem('todos', JSON.stringify(this.localTodos));
 */    return allTodos;
  }

  filterBy(filter: string, todos?: Todo[]) {
    const allTodos = todos ? todos : this.loadTodos();
    if (filter === 'true') {
      return allTodos.filter(todo => todo.completed === true);
    } else if (filter === 'false') {
      return allTodos.filter(todo => todo.completed === false);
    }
    return this.localTodos;
  }
  filterByDateRange(from: string, to: string, todos?: Todo[]) {
    const allTodos = todos ? todos : this.loadTodos();
    return allTodos.filter(todo => {
      const deadline = new Date(todo.deadline);
      return deadline >= new Date(from) && deadline <= new Date(to);
    })
  }
  deleteTodosByBereichsId(bereichsId: number): void {
  const filtered = this.localTodos.filter(todo => todo.bereichsID !== bereichsId);
  this.localTodos = filtered;
  this.todos.set(filtered);
  localStorage.setItem('todos', JSON.stringify(filtered));
}

  refreshComponentWithBereichId(bereichsId: number): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/todos', bereichsId]);
    });
  }

  refreshCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
}
