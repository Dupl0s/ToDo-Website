import { Component, inject, signal, ViewChild } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../model/todo.type';
import { HighlightDoneTodosDirective } from '../directives/highlight-done-todos.directive';
import { PopupComponent } from '../components/popup/popup.component';
import { CommonModule } from '@angular/common';
import todoData from '../../assets/todos.json';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [PopupComponent, CommonModule, HighlightDoneTodosDirective, RouterModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent {
  @ViewChild(PopupComponent) popup!: PopupComponent;

  todoService = inject(TodoService);
  arrayTodos: Todo[] = [];
  actualSort: string = '';
  bereichsId: number | null = null;
  actualFilter: string = '';
  ascending: boolean = false;
  dateFrom: string = '';
  dateTo: string = '';
  bereichName='';

  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService) {}

  openPopup(title: string, text: string) {
    this.popup.open(title, text, 'default');
  }
  
  openEdit(title: string, id: Todo) {
    this.popup.openEdit(title, id);
  }

  onPopupClosed() {
 */    this.applyFilterandSort();
    console.log('Popup wurde geschlossen');
  }

  ngOnInit() {
/*     this.arrayTodos = this.todoService.loadTodos();
 */    
  this.todoService.connectBackend().subscribe((data) => console.log(data.message));

  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    this.bereichsId = id ? Number(id) : null;

    if (this.bereichsId !== null) {
      const bereich = this.categoriesService.getBereiche().find(b => b.id === this.bereichsId);
      this.bereichName = bereich ? bereich.name : 'Unbekannter Bereich';
    }

    this.applyFilterandSort();
    console.log('OnInit');
  });
  }
  
  //Asking the method to createTask to take the Todo without the bereichsId(as it is not manually filled in by the user) and setting the bereichsid ourselves from above.
  createTask(taskData: Omit<Todo, 'bereichsId'>) {
    const newTask = {
      ...taskData,
      bereichsId: this.bereichsId!
    };
    console.log('New task received from popup:', newTask);
    this.todoService.addTodo(newTask as Todo);
    this.arrayTodos = this.todoService.loadTodos();
  }

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    localStorage.setItem('todos', JSON.stringify(this.arrayTodos));
  }

  deleteTodo(todoID: number) {
    this.todoService.deleteTodo(todoID);
    this.applyFilterandSort();
/*     this.arrayTodos = this.todoService.loadTodos();
 */  }

  onSort(sort: string | { from: string, to: string }) {
    if (typeof sort === 'string' && sort === '') {
      this.actualSort = '';
    }
    else {
      this.actualSort = sort as string;
    }
    this.applyFilterandSort();
  }

  onReminderClosed(): void {

    console.log('Reminder wurde geschlossen');}
    if (typeof filter === 'string' && filter === '') {
      this.actualFilter = '';
      this.dateFrom = '';
      this.dateTo = '';
    }
    else if (typeof filter === 'object' && filter.from && filter.to) {
      this.actualFilter = 'date-range';
      this.dateFrom = filter.from;
      this.dateTo = filter.to;
    }
    else {
      this.actualFilter = filter as string;
    }
    this.applyFilterandSort()
  }

  applyFilterandSort() {
    let todos = this.todoService.loadTodos();
    if (this.bereichsId !==null){
      todos= todos.filter(todo=> todo.bereichsId===this.bereichsId);
    }
    if (this.actualFilter === 'true' || this.actualFilter === 'false') {
      todos = this.todoService.filterBy(this.actualFilter, todos);
    }
    else if (this.actualFilter === 'date-range' && this.dateFrom != '' && this.dateTo != '') {
      todos = this.todoService.filterByDateRange(this.dateFrom, this.dateTo, todos);
    }
    if (this.actualSort != '') {
      todos = this.todoService.sortBy(this.actualSort as keyof Todo, this.ascending, todos);
    }
    else if (this.actualSort === '') {
      console.log("no sort, default")
      this.actualSort = 'completed';
      this.ascending = true;
      todos = this.todoService.sortBy(this.actualSort as keyof Todo, this.ascending, todos);
    }

    return this.arrayTodos = todos;
  }

  getBool(ascend: boolean) {
    this.ascending = ascend;
    this.applyFilterandSort();
  }
}