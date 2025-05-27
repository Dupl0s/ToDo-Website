import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sort-filter-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-filter-dropdown.component.html',
  styleUrl: './sort-filter-dropdown.component.css'
})
export class SortFilterDropdownComponent {
  @Input() options: { label: string, value: string }[] = [];
  @Input() title: string = 'Sortieren/Filtern nach';
  @Input() actualSort: string = '';
  @Output() select = new EventEmitter<string>();
  todoService = inject(TodoService);

  onSelect(value: string, label: string) {
    this.select.emit(value);
    this.actualSort = label;
    }
}
