import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Todo } from '../model/todo.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  http = inject(HttpClient);
  
  localTodos: Todo[] = [
    { id: 7, userId: 1, title: 'Beispiel Todo 1', completed: false, deadline: '2025-10-15', niveau: 3, importance: 5 },
    { id: 8, userId: 1, title: 'Beispiel Todo 2', completed: true, deadline: '2025-11-20', niveau: 2, importance: 4 },
    { id: 9, userId: 1, title: 'Beispiel Todo 3', completed: true, deadline: '2025-11-20', niveau: 2, importance: 4 }
  ];
  

  getTodosFromApi(): Observable<Todo[]> {
    const url = '../assets/todos.json';
    console.log('Lade JSON von:', url);
    return this.http.get<Todo[]>(url);
/*     return this.http.get<Array<Todo>>(url);
 */  }

 addArrayTodo(newTodo: Todo): Todo[] {
  this.localTodos.push(newTodo);
  return this.localTodos;
}

getArrayTodos(){
  return this.localTodos;
}

deleteArrayTodo(id: number): Todo[] {
  const index = this.localTodos.findIndex(todo => todo.id === id);
  console.log("testnein")
  if (index !== -1) {
    this.localTodos.splice(index, 1);
    console.log("testja")
  }
  return this.localTodos;
}

sortArrayTodosByCompletion(): Todo[] {
  this.localTodos.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? -1 : 1);
  return this.localTodos;
}

markAsCompleted(id: number): Todo[] {
  const todo = this.localTodos.find(todo => todo.id === id);
  if (todo) {
    todo.completed = true;
  }
  return this.localTodos;
}
}
