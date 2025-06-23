import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Todo } from '../model/todo.type';
import { map, Observable } from 'rxjs';
import todoData from '../../assets/todos.json';
import { Bereich } from '../model/categories.type';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  http = inject(HttpClient);
  private bereiche: Bereich[]=[];

 constructor() {
    const saved = localStorage.getItem('bereiche');
    this.bereiche = saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: 'Exam' },
          { id: 2, name: 'Projekt' },
          { id: 3, name: 'Arbeit' },
          { id: 4, name: 'Einkaufen' }
        ];
  }

  getBereiche(): Bereich[]{
    return this.bereiche;
  }

  addBereich(name: string):void{
    const newId =this.bereiche.length > 0
          ? Math.max(...this.bereiche.map(b => b.id)) + 1
          : 1;
      this.bereiche.push({ id: newId, name });
      localStorage.setItem('bereiche', JSON.stringify(this.bereiche));
  }

  deleteBereich(id: number){
    this.bereiche= this.bereiche.filter((bereich)=>bereich.id!==id);
    localStorage.setItem('bereiche', JSON.stringify(this.bereiche));
  }

  handleUpdate(updatedBereich: Bereich){
    const index = this.bereiche.findIndex(b => b.id === updatedBereich.id);
    if (index !== -1) {
      this.bereiche[index].name = updatedBereich.name.trim();
      localStorage.setItem('bereiche', JSON.stringify(this.bereiche));
    }
  }
}
