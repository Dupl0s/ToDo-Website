import { Component, signal, effect } from '@angular/core';
import {Todo} from '../model/todo.type';
import { Router} from '@angular/router';

@Component({
  selector: 'app-dustbin',
  standalone: true,
  imports: [],
  templateUrl: './dustbin.component.html',
  styleUrl: './dustbin.component.css'
})
export class DustbinComponent {
  dustbin= signal<Array<Todo>>(JSON.parse(localStorage.getItem('dustbin') || '[]'));

  restore(todoId:number){
    const restore= this.dustbin().find(todo => todo.id===todoId);
    if (restore){
      const todos= JSON.parse(localStorage.getItem('todos') || '[]');
      todos.push(restore);
      localStorage.setItem('todos', JSON.stringify(todos));
    }
    this.dustbin.set(this.dustbin().filter(todo=> todo.id !==todoId));
    localStorage.setItem('dustbin', JSON.stringify(this.dustbin()));
    
  }
}
