import { Bereiche } from '../models/Bereiche';

export interface BereicheRepository {
  getAll(): Bereiche[];
  add(name: string): Bereiche;
  delete(id: number): void;
  update(bereich: Bereiche): void;
}
