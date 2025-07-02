import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Popover } from 'bootstrap';

@Directive({
  selector: '[appHighlightDoneTodos]',
  standalone: true
})
export class HighlightDoneTodosDirective implements OnChanges {
  @Input('appHighlightDoneTodos') isCompleted: boolean = false;
  @Input() wasJustCompleted: boolean = false;
  constructor(private el: ElementRef) {}
  private popover!: Popover;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isCompleted']) {
      this.updateStyles();
/*       if(this.isCompleted && this.wasJustCompleted){
        this.initPopover();
      }
      else {
        this.dismissPopover();
      } */
    }
  }

  private updateStyles() {
    if (this.isCompleted){
      this.el.nativeElement.style.backgroundColor = '#5fbe85';
    }
    else {
      this.el.nativeElement.style.backgroundColor = '#ed6276'; // Zurücksetzen, wenn nicht completed
    }
  }
/*   private initPopover() {
    this.popover = new Popover(this.el.nativeElement, {
      trigger: 'manual',
      content: 'Dieses Todo ist erledigt!',
      placement: 'top',
      title: 'Woohooo!',
      customClass: 'popover',
    });
    this.popover.show()
    setTimeout(() => this.dismissPopover(), 2000);
  }
  private dismissPopover() {
    if (this.popover) {
      this.popover.hide();
    }
  } */
  }