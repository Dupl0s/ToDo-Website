import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Bereich } from '../model/categories.type';
import { TodoService } from './todo.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private http = inject(HttpClient);
  private apiUrl = '/api/bereiche';

  constructor(private todoService: TodoService){}

  getBereiche(): Observable<Bereich[]> {
    return this.http.get<Bereich[]>(this.apiUrl);
  }

  addBereich(name: string): Observable<Bereich> {
    return this.http.post<Bereich>(this.apiUrl, { name });
  }

  deleteBereich(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  handleUpdate(bereich: Bereich): Observable<Bereich> {
    return this.http.put<Bereich>(`${this.apiUrl}/${bereich.id}`, bereich);
  }

  todosInBereich(bereichId: number):boolean{
    const todos=this.todoService.loadTodos();
    return todos.some(todo=> todo.bereichsId === bereichId);
  }
}

