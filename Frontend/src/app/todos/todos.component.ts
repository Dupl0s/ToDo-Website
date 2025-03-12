import { Component, inject, signal, effect, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import { map } from 'rxjs';
import { TodoitemComponent } from "../components/todoitem/todoitem.component";
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { PopupComponent } from '../components/popup/popup.component';
import { NgFor } from '@angular/common';
import { ArrayTodoitemComponent } from "../arraytodoitem/arraytodoitem.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; //

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [TodoitemComponent, HighlightDoneTodosDirective, PopupComponent,CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {

  constructor(private todoService2 : TodoService){
  }
  @ViewChild(PopupComponent) popup!: PopupComponent;

  todos = signal<Array<Todo>>(JSON.parse(localStorage.getItem('todos') || '[]'));
  /*dustbin = signal<Array<Todo>>(JSON.parse(localStorage.getItem('dustbin') || '[]'));*/
  todoService = inject(TodoService);  
  arrayTodos: Todo[] = [];

  openPopup() {
    this.popup.open('ToDo hinzufügen', 'Fügen Sie Ihr geplantes ToDo hinzu');
  }

  onPopupClosed() {
    console.log('Popup wurde geschlossen');
    this.loadTodos();
  }

  ngOnInit() {
    this.loadTodos();
    this.arrayTodos = this.todoService2.getArrayTodos();
  }

  loadTodos() {
    if (this.todos().length === 0) {
      this.todoService.getTodosFromApi()
        .pipe(
          map(data => data.slice(0, 9)) // Optional: Lade nur die ersten 9 Todos
        )
        .subscribe((data) => {
          this.todos.set(data);
        });
    }
  }

  sortedTodos() {
    return this.todos().slice().sort((a, b) => Number(a.completed) - Number(b.completed));
  }
  deleteTodo(todoId: number) {
    this.todos.set(this.todos().filter(todo => todo.id !== todoId));
  }

  deleteArrayTodo(todoID: number){
    this.todoService2.deleteArrayTodo(todoID);
  }

  markDoneArrayToDo(id: number) {
    this.todoService.markAsCompleted(id);
  }


  /*   constructor() {
      effect(() => {
        localStorage.setItem('todos', JSON.stringify(this.todos()));
      });
    } */

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    this.todos.set(this.todos().slice().sort((a, b) => Number(a.completed) - Number(b.completed)));
  }

  

}


