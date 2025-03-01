import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import { map } from 'rxjs';
import { TodoitemComponent } from "../components/todoitem/todoitem.component";

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [TodoitemComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {

  todos = signal<Array<Todo>>([])
  todoService = inject(TodoService);

  ngOnInit() {
    this.todoService.getTodosFromApi()
    .pipe(
      map(data => data.slice(0, 6))
    )
    .subscribe((data) => {
      this.todos.set(data);
    });
  }
}
