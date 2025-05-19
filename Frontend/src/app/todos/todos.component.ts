import { Component, inject, signal, effect, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { map } from 'rxjs';
import { TodoitemComponent } from "../components/todoitem/todoitem.component";
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { PopupComponent } from '../components/popup/popup.component';
import { NgFor } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; //
import { RouterModule } from '@angular/router';
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { Todo } from '../model/todo.type';

@Component({
  selector: 'app-todos',
  standalone: true,
<<<<<<< HEAD
  imports: [PopupComponent,CommonModule, TodoitemComponent, RouterModule],
=======
  imports: [TodoitemComponent, RouterModule, HighlightDoneTodosDirective],
>>>>>>> origin/Papierkorb
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {

  constructor(private todoService2 : TodoService){
  }
  @ViewChild(PopupComponent) popup!: PopupComponent;

  todos = signal<Array<Todo>>(JSON.parse(localStorage.getItem('todos') || '[]'));
  dustbin = signal<Array<Todo>>(JSON.parse(localStorage.getItem('dustbin') || '[]'));
<<<<<<< HEAD
  todoService = inject(TodoService);  
  arrayTodos: Todo[] = [];

  openPopup() {
    this.popup.open('ToDo hinzufügen', 'Fügen Sie Ihr geplantes ToDo hinzu');
  }

  onPopupClosed() {
    console.log('Popup wurde geschlossen');
    this.loadTodos();
  }
=======
  todoService = inject(TodoService);
>>>>>>> origin/Papierkorb

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
<<<<<<< HEAD
  
 
  deleteArrayTodo(todoID: number){
    this.todoService2.deleteArrayTodo(todoID);
  }

  markDoneArrayToDo(id: number) {
    this.todoService.markAsCompleted(id);
  }

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    this.todos.set(this.todos().slice().sort((a, b) => Number(a.completed) - Number(b.completed)));
  }

=======
 
>>>>>>> origin/Papierkorb
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