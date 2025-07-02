import { Bereich } from '../model/Bereich';
import { BereichRepository } from './BereichRepository';

export class InMemoryBereichRepository implements BereichRepository {
  private bereiche: Bereich[] = [
    { id: 1, name: 'Exam' },
    { id: 2, name: 'Projekt' },
    { id: 3, name: 'Arbeit' },
    { id: 4, name: 'Einkaufen' }
  ];

  getAll(): Bereich[] {
    return this.bereiche;
  }
  
  add(name: string): Bereich {
    const newId = this.bereiche.length > 0
      ? Math.max(...this.bereiche.map(b => b.id)) + 1
      : 1;
    const newBereich: Bereich= { id: newId, name };
    this.bereiche.push(newBereich);
    return newBereich;
  }

  delete(id: number): void {
    this.bereiche = this.bereiche.filter(b => b.id !== id);
  }

  update(updateBereich: Bereich): void {
    const index = this.bereiche.findIndex(b => b.id === updateBereich.id);
    if (index !== -1) {
      this.bereiche[index] = updateBereich;
    }
  }

  findById(id: number): Bereich | undefined {
    return this.bereiche.find(b => b.id === id);
  }
}
