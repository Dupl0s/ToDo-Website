import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Todo } from '../model/todo.type';
import { map, Observable } from 'rxjs';
import todoData from '../../assets/todos.json';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  http = inject(HttpClient);

  localTodos: Todo[] = [
    {
      id: 7,
      userId: 1,
      title: 'Beispiel Todo 1',
      completed: false,
      deadline: '2025-10-15',
      niveau: 3,
      importance: 5,
    },
    {
      id: 8,
      userId: 1,
      title: 'Beispiel Todo 2',
      completed: true,
      deadline: '2025-11-20',
      niveau: 2,
      importance: 4,
    },
    {
      id: 9,
      userId: 1,
      title: 'Beispiel Todo 3',
      completed: true,
      deadline: '2025-11-20',
      niveau: 2,
      importance: 4,
    },
  ];
  todos = signal<Array<Todo>>(
    JSON.parse(localStorage.getItem('todos') || '[]')
  );

  loadTodos() {

    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.localTodos = JSON.parse(savedTodos);
    } else {
      this.localTodos = todoData;
      localStorage.setItem('todos', JSON.stringify(this.localTodos));
    }
    console.log("loadTodos")
    return this.localTodos;
  }

  getTodosFromApi(): Observable<Todo[]> {
    const url = '../assets/todos.json';
    console.log('Lade JSON von:', url);
    return this.http.get<Todo[]>(url);
    /*     return this.http.get<Array<Todo>>(url);
     */
  }

  addTodo(newTodo: Todo) {
    console.log("addTodo")
    this.localTodos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(this.localTodos));
    return this.localTodos;
  }

  /*deleteTodo(id: number) {
    const index = this.localTodos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.localTodos.splice(index, 1);
    } 
    localStorage.setItem('todos', JSON.stringify(this.localTodos));
    console.log("delete")
    return this.localTodos;
  }*/

  clearStorage() {
    //maybe to clear all the todos that are done?
  }


  dustbin = signal<Array<Todo>>(JSON.parse(localStorage.getItem('dustbin') || '[]'));

  /*deleteTodo(id: number) {
  const index = this.localTodos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    const deletedTodo = this.localTodos[index];

    this.localTodos.slice(index, 1);
    localStorage.setItem('todos', JSON.stringify(this.localTodos));

    this.addToDustbin(deletedTodo);
  }*/
 
  deleteTodo(id: number): Todo[] {
    const current = this.todos();
    const index = current.findIndex(todo => todo.id === id);

    if (index !== -1) {
      const deletedTodo = current[index];
      const updatedTodos = current.filter(todo => todo.id !== id);

      this.todos.set(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));

      this.addToDustbin(deletedTodo);
    }

  return this.localTodos;
 }

  addToDustbin(todo: Todo) {
    const currentDustbin = this.dustbin();
    const updatedDustbin = [...currentDustbin, todo];
    this.dustbin.set(updatedDustbin);
    localStorage.setItem('dustbin', JSON.stringify(updatedDustbin));
  }

  getDustbin(): Todo[] {
    return this.dustbin();
  }
  deleteFromDustbin(id: number) {
  const updatedDustbin = this.dustbin().filter(todo => todo.id !== id);
  this.dustbin.set(updatedDustbin);
  localStorage.setItem('dustbin', JSON.stringify(updatedDustbin));
}
}

