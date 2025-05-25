import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-dustbin',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './dustbin.component.html',
  styleUrl: './dustbin.component.css'
})
export class DustbinComponent {
  todoService = inject(TodoService);

  get dustbinTodos(): Todo[] {
    return this.todoService.dustbin()
      .slice()
      .sort((a, b) => Number(a.completed) - Number(b.completed));
  }

  restore(todoId: number) {
    const currentDustbin = this.todoService.dustbin();
    const restored = currentDustbin.find(todo => todo.id === todoId);

    if (restored) {
      const updatedTodos = [...this.todoService.localTodos, restored];
      this.todoService.todos.set(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));

      const updatedDustbin = currentDustbin.filter(todo => todo.id !== todoId);
      this.todoService.dustbin.set(updatedDustbin);
      localStorage.setItem('dustbin', JSON.stringify(updatedDustbin));
    }
  }
  deletePermanently(id: number): void {
  this.todoService.deleteFromDustbin(id);
}
}
