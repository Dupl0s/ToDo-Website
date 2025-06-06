import {Component, input } from '@angular/core';
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
}
