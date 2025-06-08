import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sort-filter-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sort-filter-dropdown.component.html',
  styleUrl: './sort-filter-dropdown.component.css'
})
export class SortFilterDropdownComponent {

  @Input() options: { label: string, value: string }[] = [];
  @Input() title: string = 'Sortieren/Filtern nach';
  @Input() actualSort: string = '';
  @Input() actualAscending: boolean = true;
  @Input() isSortDropdown: boolean = false;
  @Output() select = new EventEmitter<string | { from: string, to: string }>();
  @Output() ascend = new EventEmitter<boolean>();

  showDateRange = false;
  dateFrom: string = '';
  dateTo: string = '';
  ascending: boolean = true;

  todoService = inject(TodoService);

  onSelect(value: string) {
    if (value === 'date-range') {
      this.showDateRange = true;
    } else {
      this.showDateRange = false;
      /* Wieder auf leer zurücksetzen: */
      this.dateFrom= '';
      this.dateTo = '';
    }
    this.select.emit(value);
    this.actualSort = value;
  }

  applyDateRange() {
    if (this.dateFrom && this.dateTo) {
      this.select.emit({ from: this.dateFrom, to: this.dateTo });
/*       this.showDateRange = false;
 */    }
  }
  
  get actualLabel(): string | undefined {
    return this.options.find(opt => opt.value === this.actualSort)?.label;
  }

  toggleAscending() {
    this.ascend.emit(!this.actualAscending);
}
}
