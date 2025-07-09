import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Bereich } from '../model/categories.type';
import { TodoService } from './todo.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/sections';

  constructor(private todoService: TodoService) { }

  getBereiche(userid: string): Observable<Bereich[]> {
    return this.http.get<{ sections: Bereich[] }>(this.apiUrl,
      {
        params: { userid: userid }
      })
      .pipe(
        map(response => response.sections || [])
      );
  }


  addBereich(name: string, userid: string): Observable<Bereich> {
    const body = { name, userid };
    return this.http.post<{ section: Bereich }>(this.apiUrl, body)
      .pipe(
        map(response => response.section)
      );
  }

  deleteBereich(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  handleUpdate(bereich: Bereich): Observable<Bereich> {
    return this.http.put<{ section: Bereich }>(this.apiUrl + '/' + bereich.id, bereich)
      .pipe(
        map(response => response.section)
      );
  }

  todosInBereich(bereichId: number): boolean {
    const todos = this.todoService.loadTodos();
    return todos.some(todo => todo.bereichsID === bereichId);
  }
  todosInBerech(bereichId: number): boolean {
    const todos = this.todoService.loadTodos();
    return todos.some(todo => todo.bereichsID === bereichId); // checks if there is at least 1 element
  }
}

