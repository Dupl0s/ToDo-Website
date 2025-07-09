import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import {RouterModule} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../model/user.type';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dustbin',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './dustbin.component.html',
  styleUrl: './dustbin.component.css'
})
export class DustbinComponent {
  todoService = inject(TodoService);
  http = inject(HttpClient);
  userService = inject(UserService);

  bereichsId: number | null = null;
  user?: User | null;
  dustbinTodosForBereich: Todo[] = [];

  constructor(private route: ActivatedRoute) {
    this.userService.user.subscribe((user) => {
      this.user = user;
      if (this.user?.userId) {
        // Dustbin laden wenn User verfügbar
        this.todoService.loadDustbin();
      }
    });
    
    this.route.paramMap.subscribe(params => {
      this.bereichsId = Number(params.get('id'));
      this.loadDustbinTodosForBereich();
    });
  }

  loadDustbinTodosForBereich() {
    if (this.bereichsId && this.user?.userId) {
      const params = new HttpParams()
        .set('userId', this.user.userId.toString())
        .set('deleted', 'true');

      this.http.get<{ todos: Todo[] }>(
        `https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${this.bereichsId}`,
        { params }
      ).subscribe({
        next: (response) => {
          this.dustbinTodosForBereich = response.todos
            .sort((a: Todo, b: Todo) => Number(a.completed) - Number(b.completed));
        },
        error: (error) => {
          console.error('Error loading dustbin todos:', error);
          // Fallback: Aus LocalStorage filtern
          const stored = localStorage.getItem('dustbin');
          if (stored) {
            const parsed = JSON.parse(stored);
            this.dustbinTodosForBereich = parsed
              .filter((todo: Todo) => todo.bereichsID === this.bereichsId && todo.deleted === true)
              .sort((a: Todo, b:Todo) => Number(a.completed) - Number(b.completed));
          }
        }
      });
    }
  }

  get dustbinTodos(): Todo[] {
    return this.dustbinTodosForBereich;
  }

  restore(todoId: number) {
    const todoToRestore = this.dustbinTodosForBereich.find(todo => todo.id === todoId);

    if (todoToRestore) {
      // Komplettes Todo mit deleted: false senden
      const restoredTodo = { 
        ...todoToRestore, 
        deleted: false,
        userID: todoToRestore.userId || this.user?.userId // userID für Backend
      };
      
      console.log('Restoring todo:', restoredTodo); // Debug log
      
      this.http.put<{ todo: Todo }>(
        `https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${todoId}`,
        restoredTodo
      ).subscribe({
        next: (response) => {
          console.log('Todo restored:', response.todo);
          this.loadDustbinTodosForBereich();
          this.todoService.refreshCurrentRoute();
        },
        error: (error) => {
          console.error('Error restoring todo:', error);
        }
      });
    }
  }

  deletePermanently(id: number): void {
    this.http.delete(
      `https://todobackend-dupl0s-janniks-projects-e7141841.vercel.app/todos/${id}`
    ).subscribe({
      next: () => {
        console.log('Todo permanently deleted');
        this.loadDustbinTodosForBereich();
        this.todoService.refreshCurrentRoute();
      },
      error: (error) => {
        console.error('Error permanently deleting todo:', error);
      }
    });
  }
}
