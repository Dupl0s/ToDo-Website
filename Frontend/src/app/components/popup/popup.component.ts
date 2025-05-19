import { Component, EventEmitter, Output, signal } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../model/todo.type';
import { TodoService } from '../../services/todo.service';





@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  constructor(private todoService : TodoService){
  
  }
  
  isOpen = signal(false);
  title = signal('');
  message = signal('');
  todos = signal<Array<Todo>>(JSON.parse(localStorage.getItem('todos') || '[]'));

  title2 = signal('');        
  niveau = signal(1);        
  importance = signal(1);    
  deadline = signal('');    

  @Output() todoSaved = new EventEmitter<Todo>();
  @Output() 
  @Output() closed = new EventEmitter<void>();

  open(title: string, message: string) {
    this.title.set(title);
    this.message.set(message);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.closed.emit();
  }

    save(){
      const newTodo: Todo = {
        id: Date.now(),  
        userId: 1,      
        completed: false, 
        title: this.title2(), 
        deadline: this.deadline(), 
        niveau: this.niveau(),           
        importance: this.importance()    
      };

      
      this.todoService.addArrayTodo(newTodo);
      this.close();
    }
  todayDate: string = '';

  ngOnInit(): void {
    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0'); 

    this.todayDate = `${yyyy}-${mm}-${dd}`; 
  }


}
