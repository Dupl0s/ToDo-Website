import {Component, input } from '@angular/core';
import { AfterViewInit, Component, ElementRef, Input, input, ViewChild } from '@angular/core';
import { Todo } from '../../model/todo.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todoitem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todoitem.component.html',
  styleUrl: './todoitem.component.css'
})

export class TodoitemComponent{
  todo = input.required<Todo>();
<<<<<<< HEAD
  deleteTodos = input.required<(id: number) => void>();

  /* remove(id:number) {
    this.deleteTodos(this.todo().id);
  } */
  toggleCompleted(todo: Todo) {
    todo.completed = true;
  }

=======
>>>>>>> main
}
