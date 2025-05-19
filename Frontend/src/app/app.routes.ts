import { Routes } from '@angular/router';
import { TodosComponent } from './todos/todos.component';

export const routes: Routes = [
    /*{path: 'todos', loadComponent: () => {
        return import('./todos/todos.component').then((m) => m.TodosComponent)
    }},*/
    {path: 'dustbin', loadComponent: () => {
        return import('./dustbin/dustbin.component').then((z) => z.DustbinComponent)
    }},
    {path: 'categories', loadComponent: () => {
        return import('./categories/categories.component').then((t) => t.CategoriesComponent)
    }},
    {path: '', loadComponent: () => {
        return import('./home/home.component').then((z) => z.HomeComponent)
    }},
    {path: "todos", component: TodosComponent}
];
