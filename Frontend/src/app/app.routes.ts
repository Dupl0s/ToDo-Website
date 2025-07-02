import { Routes } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { DustbinComponent } from './dustbin/dustbin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { LoggedActivate } from './helpers/logged.activate';
import { UserEditComponent } from './user-edit/user-edit.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CategoriesComponent } from './categories/categories.component';

export const routes: Routes = [/*{
    path: 'todos',
    loadComponent: () => {
        return import('./todos/todos.component').then((m) => m.TodosComponent)
    }
}*/

/* !!!Kein Zugriff ohne Login mit canActivate: [LoggedActivate],
 bitte auch bei Bereiche etc hinzufügen */

{path: "todos", component: TodosComponent, canActivate: [LoggedActivate]},
{ path: "dustbin", component: DustbinComponent, canActivate: [LoggedActivate] },
{ path: '', component: HomeComponent },
{path: 'login', component: LoginComponent},
{path: 'registration', component: RegistrationComponent},
{path: 'password-reset', component: PasswordResetComponent},
{path: 'user-edit', component: UserEditComponent, canActivate: [LoggedActivate]},
{path: "categories", component: CategoriesComponent, canActivate: [LoggedActivate]},
{path: "todos/:id", component: TodosComponent, canActivate: [LoggedActivate]},
{path: 'calendar', component: CalendarComponent, canActivate: [LoggedActivate]},
{ path: 'dustbin/:id', component: DustbinComponent, canActivate: [LoggedActivate] }
];
