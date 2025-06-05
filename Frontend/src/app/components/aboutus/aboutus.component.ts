import { Component } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  imports: [],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
  accordionOpen = [false, false]; // Ein Wert pro Accordion-Item

  toggleAccordion(index: number) {
    this.accordionOpen[index] = !this.accordionOpen[index];
  }
}
