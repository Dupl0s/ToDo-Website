import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Todo } from '../model/todo.type';
import { map, Observable } from 'rxjs';
import todoData from '../../assets/todos.json';
import { CategoriesService } from '../services/categories.service';
import { Bereich } from '../model/categories.type';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  
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
      bereichsId: 1,
    },
    {
      id: 8,
      userId: 1,
      title: 'Beispiel Todo 2',
      completed: true,
      deadline: '2025-11-20',
      niveau: 2,
      importance: 4,
      bereichsId: 1,
    },
    {
      id: 9,
      userId: 1,
      title: 'Beispiel Todo 3',
      completed: true,
      deadline: '2025-11-20',
      niveau: 2,
      importance: 4,
      bereichsId: 1,
    },
  ];
  todos = signal<Array<Todo>>(
    this.loadTodos()
  );


  connectBackend() {
    return this.http.get<{ message: string }>('/api/backend');
  }

  loadTodos() {
    this.http.get<Todo[]>('https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos')
      .subscribe((data) => { 
        this.localTodos = data;
        localStorage.setItem('todos', JSON.stringify(this.localTodos));
        this.todos.set(this.localTodos);
        console.log('Todos loaded from API:', this.localTodos);
      });

    
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.localTodos = JSON.parse(savedTodos);
    } else {
      this.localTodos = todoData;
      localStorage.setItem('todos', JSON.stringify(this.localTodos));
    }
    return this.localTodos;
  }

  getTodosFromApi(): Observable<any> {
    return this.http.get('https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos');
  }

  getTodosFromApiWithID(bereichId: number) {
    console.log("test" + this.http.get('https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/' + bereichId));
    console.log('https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/' + bereichId);
    return this.http.get('https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/' + bereichId);
    
  }

  addTodo(newTodo: Todo) {
    this.http.post<Todo>('https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos', newTodo)
      .subscribe((todo) => {
        this.todos.set(this.localTodos);
        localStorage.setItem('todos', JSON.stringify(this.localTodos));
        console.log('Todo added:', todo);
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
    });
  }

  dustbin = signal<Array<Todo>>(
    JSON.parse(localStorage.getItem('dustbin') || '[]')
  );


  deleteTodo(id: number) {
    this.http.delete(`https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${id}`)
    this.getTodosFromApi();
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
    const allTodos = (todos ? todos : this.loadTodos().slice());
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
  const filtered = this.localTodos.filter(todo => todo.bereichsId !== bereichsId);
  this.localTodos = filtered;
  this.todos.set(filtered);
  localStorage.setItem('todos', JSON.stringify(filtered));
}
}
