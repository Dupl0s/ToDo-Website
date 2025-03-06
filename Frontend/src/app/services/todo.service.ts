import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Todo } from '../model/todo.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  http = inject(HttpClient);

  getTodosFromApi(): Observable<Todo[]> {
    const url = '../assets/todos.json';
    console.log('Lade JSON von:', url);
    return this.http.get<Todo[]>(url);
/*     return this.http.get<Array<Todo>>(url);
 */  }

}
