import { Component, inject, signal, effect, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import { map } from 'rxjs';
import { TodoitemComponent } from "../components/todoitem/todoitem.component";
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { PopupComponent } from '../components/popup/popup.component';
import { NgFor } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import todoData from 'C:/Users/haaseja/Desktop/DHBW/Bericht Repo/ToDo-Website/Frontend/src/assets/todos.json'

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [PopupComponent,CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent {
  @ViewChild(PopupComponent) popup!: PopupComponent;

  todos = signal<Array<Todo>>(JSON.parse(localStorage.getItem('todos') || '[]'));
  /*dustbin = signal<Array<Todo>>(JSON.parse(localStorage.getItem('dustbin') || '[]'));*/
  todoService = inject(TodoService);  
  arrayTodos: Todo[] = [];

  openPopup(title:string, text: string) {
    this.popup.open(title, text);
  }

  openEdit(title:string, id: Todo){
    this.popup.openEdit(title, id);
  }

  onPopupClosed() {
    console.log('Popup wurde geschlossen');
    this.todoService.loadTodos();
  }

  ngOnInit() {
    this.arrayTodos = this.todoService.loadTodos();   
  }
  sortedTodos() {
    return this.todos().slice().sort((a, b) => Number(a.completed) - Number(b.completed));
  }
  deleteTodo(todoId: number) {
    this.todos.set(this.todos().filter(todo => todo.id !== todoId));
  }

  deleteArrayTodo(todoID: number){
    this.todoService.deleteTodo(todoID);
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


