import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Todo } from '../model/todo.type';
import { map, Observable } from 'rxjs';
import todoData from '../../assets/todos.json';

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
    },
    {
      id: 8,
      userId: 1,
      title: 'Beispiel Todo 2',
      completed: true,
      deadline: '2025-11-20',
      niveau: 2,
      importance: 4,
    },
    {
      id: 9,
      userId: 1,
      title: 'Beispiel Todo 3',
      completed: true,
      deadline: '2025-11-20',
      niveau: 2,
      importance: 4,
    },
  ];
  todos = signal<Array<Todo>>(
    JSON.parse(localStorage.getItem('todos') || '[]')
  );

  loadTodos() {
    /* if (this.todos().length === 0) {
      this.getTodosFromApi()
        .pipe(
          map(data => data.slice(0, 9)) // Optional: Lade nur die ersten 9 Todos
        )
        .subscribe((data) => {
          this.todos.set(data);
        });
    }*/
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.localTodos = JSON.parse(savedTodos);
    } else {
      this.localTodos = todoData;
      localStorage.setItem('todos', JSON.stringify(this.localTodos));
    }

    return this.localTodos;
  }

  getTodosFromApi(): Observable<Todo[]> {
    const url = '../assets/todos.json';
    console.log('Lade JSON von:', url);
    return this.http.get<Todo[]>(url);
    /*     return this.http.get<Array<Todo>>(url);
     */
  }

  sortArrayTodosByCompletion(): Todo[] {
    this.localTodos.sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? -1 : 1
    );
    return this.localTodos;
  }

  markAsCompleted(id: number): Todo[] {
    const todo = this.localTodos.find((todo) => todo.id === id);
    if (todo) {
      todo.completed = true;
    }
    return this.localTodos;
  }

  addTodo(newTodo: Todo) {
    this.localTodos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(this.localTodos));
  }

  deleteTodo(id: number) {
    const index = this.localTodos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.localTodos.splice(index, 1);
    }
    localStorage.setItem('todos', JSON.stringify(this.localTodos));
    return this.localTodos;
  }

  clearStorage() {
    //maybe to clear all the todos that are done?
  }
}
