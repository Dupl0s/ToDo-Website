import { Component, inject, signal, effect } from '@angular/core';
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
  todos = signal<Array<Todo>>(JSON.parse(localStorage.getItem('todos') || '[]'));
  dustbin = signal<Array<Todo>>(JSON.parse(localStorage.getItem('dustbin') || '[]'));
  todoService = inject(TodoService);

  ngOnInit() {
  if (this.todos().length === 0) {  
    this.todoService.getTodosFromApi()
    .pipe(
      map(data => data.slice(0, 6))
    )
    .subscribe((data) => {
      this.todos.set(data);
    });
  }
}

  deleteTodo(todoId: number){
    this.todos.set(this.todos().filter(todo => todo.id !== todoId));  
  }
  constructor() {
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todos()));
    });
  }
}
