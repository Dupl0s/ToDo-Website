import { Bereich } from '../model/Bereich';

export interface BereichRepository {
  getAll(): Bereich[];
  add(name: string): Bereich;
  delete(id: number): void;
  update(bereich: Bereich): void;
  findById(id: number): Bereich | undefined;
}
