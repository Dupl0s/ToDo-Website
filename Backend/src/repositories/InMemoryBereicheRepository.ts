import { BereicheRepository } from './BereicheRepository';
import { Bereiche } from '../models/Bereiche';

export class InMemoryBereichRepository implements BereicheRepository {
  private bereiche: Bereiche[] = [
    { id: 1, name: 'Exam' },
    { id: 2, name: 'Projekt' },
    { id: 3, name: 'Arbeit' },
    { id: 4, name: 'Einkaufen' }
  ];

  getAll(): Bereiche[] {
    return this.bereiche;
  }

  add(name: string): Bereiche {
    const newId = this.bereiche.length > 0
      ? Math.max(...this.bereiche.map(b => b.id)) + 1
      : 1;
    const newBereich: Bereiche = { id: newId, name };
    this.bereiche.push(newBereich);
    return newBereich;
  }

  delete(id: number): void {
    this.bereiche = this.bereiche.filter(b => b.id !== id);
  }

  update(updatedBereich: Bereiche): void {
    const index = this.bereiche.findIndex(b => b.id === updatedBereich.id);
    if (index !== -1) {
      this.bereiche[index].name = updatedBereich.name;
    }
  }
}
