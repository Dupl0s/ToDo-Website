import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import { Todo } from '../../model/todo.type';
import { CommonModule } from '@angular/common';
import { Popover} from 'bootstrap'

@Component({
  selector: 'app-todoitem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todoitem.component.html',
  styleUrl: './todoitem.component.css'
})
export class TodoitemComponent implements AfterViewInit {
  @ViewChild('popoverButton') popoverButton!: ElementRef;
  private popover!: Popover;

  ngAfterViewInit() {
    this.popover = new Popover(this.popoverButton.nativeElement, {
      trigger: 'click',
    });
    this.popoverButton.nativeElement.addEventListener('shown.bs.popover', () => {
      setTimeout(() => this.dismissPopover(), 3000);
    })
  }

  dismissPopover() {
    if (this.popover) {
      this.popover.hide(); // Oder dispose(), wenn es komplett entfernt werden soll
    }
  }

  todo = input.required<Todo>();

  toggleCompleted(todo: Todo) {
    todo.completed = true;
  }

}
