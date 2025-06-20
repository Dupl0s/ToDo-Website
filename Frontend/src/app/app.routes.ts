import { Routes } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { DustbinComponent } from './dustbin/dustbin.component';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';


export const routes: Routes = [/*{
    path: 'todos',
    loadComponent: () => {
        return import('./todos/todos.component').then((m) => m.TodosComponent)
    }
}*/
{path: "categories", component: CategoriesComponent},
{path: "todos/:id", component: TodosComponent},
{path: "todos", component: TodosComponent},
{ path: "dustbin", component: DustbinComponent },
{ path: 'dustbin/:id', component: DustbinComponent },
{ path: '', component: HomeComponent }
];
