import { Routes } from '@angular/router';
import { TodosComponent } from './todos/todos.component';

export const routes: Routes = [/*{
    path: 'todos',
    loadComponent: () => {
        return import('./todos/todos.component').then((m) => m.TodosComponent)
    }
}*/
{path: "todos", component: TodosComponent}
];
