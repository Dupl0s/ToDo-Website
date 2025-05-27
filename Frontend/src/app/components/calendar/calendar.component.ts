import { Component, AfterViewInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../model/todo.type';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements AfterViewInit {

  todos: Todo[] = [];
  constructor(private todoService: TodoService) {
    this.todos = this.todoService.loadTodos()
  }

  ngAfterViewInit() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
      const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: [
          ...this.todos.map(todo => ({
            title: todo.title,
            start: todo.deadline,
            allDay: true,
            color: todo.completed ? 'green' : 'red',
            extendedProps: {
              niveau: todo.niveau,
              importance: todo.importance
            }
          }))
        ]
      });
      calendar.render();
    }
  }
}
