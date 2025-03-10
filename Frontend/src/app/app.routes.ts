import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'todos', loadComponent: () => {
        return import('./todos/todos.component').then((m) => m.TodosComponent)
    }},
    {path: 'dustbin', loadComponent: () => {
        return import('./dustbin/dustbin.component').then((z) => z.DustbinComponent)
    }},
    {path: '', loadComponent: () => {
        return import('./home/home.component').then((z) => z.HomeComponent)
    }}
];
