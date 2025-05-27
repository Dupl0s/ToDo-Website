import { Component, EventEmitter, Output, signal } from '@angular/core';
import { Todo } from '../../model/todo.type';

@Component({
  selector: 'app-reminder',
  imports: [],
  standalone: true,
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.css',
})
export class ReminderComponent {
  isOpen = signal(false);
  title = signal('');
  message = signal('');

  @Output() closed = new EventEmitter<void>();

  ngOnInit() {
    this.checkForReminders();
  }

  checkForReminders() {
    const todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const reminders = todos.filter((todo) => {
      if (!todo.deadline) return false;
      const deadline = new Date(todo.deadline); 
      deadline.setHours(23, 59, 59, 999);
      return !todo.completed && deadline <= tomorrow;
    });
    if (reminders.length > 0) {
      this.open(
        'Erinnerung',
        `Du hast ${reminders.length} unerledigte ToDos, die fällig sind!`
      );
    }
  }

  open(title: string, message: string) {
    this.title.set(title);
    this.message.set(message);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.closed.emit();
  }
}
