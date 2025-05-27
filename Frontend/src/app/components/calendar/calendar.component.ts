import { Component, AfterViewInit } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../model/todo.type';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements AfterViewInit {
  todos: Todo[] = [];
  constructor(private todoService: TodoService) {
    this.todos = this.todoService.loadTodos();
  }

  ngAfterViewInit() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
      const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        events: [
          ...this.todos.map((todo) => ({
            title: todo.title,
            start: todo.deadline,
            allDay: true,
            end: todo.deadline,
            color: todo.completed ? 'green' : 'red',
            backgroundColor: todo.completed ? 'lightgreen' : 'lightcoral',
            borderColor: todo.completed ? 'green' : 'red',
            textColor: 'black',
            extendedProps: {
              niveau: todo.niveau,
              importance: todo.importance,
            },
          })),
        ],
      });
      calendar.render();
    }
  }
}
