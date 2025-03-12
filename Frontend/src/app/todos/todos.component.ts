import { Component, inject, signal, effect } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { map } from 'rxjs';
import { TodoitemComponent } from "../components/todoitem/todoitem.component";
import { RouterModule } from '@angular/router';
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { Todo } from '../model/todo.type';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [TodoitemComponent, RouterModule, HighlightDoneTodosDirective],
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
  sortedTodos() {
    return this.todos().slice().sort((a, b) => Number(a.completed) - Number(b.completed));
  }
 
  deleteTodo(todoId: number){
   const deletedTodo= this.todos().find(todo=> todo.id === todoId);
    if (deletedTodo){
      this.dustbin.set([...this.dustbin(), deletedTodo]);
    } 
    this.todos.set(this.todos().filter(todo => todo.id !== todoId));  
  }
  constructor() {
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todos()));
      localStorage.setItem('dustbin', JSON.stringify(this.dustbin())); 
    }); 
  } 
  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    this.todos.set(this.todos().slice().sort((a, b) => Number(a.completed) - Number(b.completed))); 
  }
}