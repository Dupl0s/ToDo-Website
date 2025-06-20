import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../model/todo.type';
import { TodoService } from '../../services/todo.service';
import { Bereich } from '../../model/categories.type';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
})
export class PopupComponent {
  constructor(private todoService: TodoService) {}
  editMode = false;
  editBereichMode=false;
  currentID = 0;
  currentUserID = 0;
  currentBereichsId=0;
  bereichName= signal('');

  isOpen = signal(false);
  title = signal('');
  message = signal('');
  todos = signal<Array<Todo>>(
    JSON.parse(localStorage.getItem('todos') || '[]')
  );

  title2 = signal('');
  niveau = signal(1);
  importance = signal(1);
  deadline = signal('');

  @Output() closed = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<Omit<Todo, 'bereichsId'>>();
  @Output() bereichEdited = new EventEmitter<{id:number; name:string}>();

  openBereichEdit(title: string, bereich:Bereich){
    this.title.set(title);
    this.isOpen.set(true);
    this.editMode=false;
    this.editBereichMode=true;
    this.bereichName.set(bereich.name);
  
    this.currentBereichsId=bereich.id;
    this.bereichName.set(bereich.name);
  }
  
  open(title: string, message: string) {
    this.title.set(title);
    this.message.set(message);
    this.isOpen.set(true);
    this.editMode = false;
    this.title2.set('');
    this.deadline.set('');
    this.importance.set(1);
    this.niveau.set(1);
  }

  openEdit(title: string, item: Todo) {
    this.title.set(title);
    this.isOpen.set(true);
    this.editMode = true;

    this.title2.set(item.title);
    this.deadline.set(item.deadline);
    this.importance.set(item.importance);
    this.niveau.set(item.niveau);
    this.currentID = item.id;
    this.currentUserID = item.userId;
  }

  close() {
    this.isOpen.set(false);
    this.closed.emit();
    this.editMode = false;
  }

  save() {
    if(this.editBereichMode){
      this.bereichEdited.emit({id: this.currentBereichsId, name: this.bereichName()});
      this.close();
    }
    else if (this.editMode) {
      // You may want to emit an event for editing, or handle edit logic in parent
      // For now, keep as is, but ideally handle bereichsId correctly
      // this.todoService.editTodo(updatedTodo);
    } else {
      // Emit only the fields except bereichsId
      this.taskCreated.emit({
        id: Date.now(),
        userId: 1,
        completed: false,
        title: this.title2(),
        deadline: this.deadline(),
        niveau: this.niveau(),
        importance: this.importance(),
      });
    }
    this.close();
  }
}