import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'todos',
    loadComponent: () => {
        return import('./todos/todos.component').then((m) => m.TodosComponent)
    }
}];
