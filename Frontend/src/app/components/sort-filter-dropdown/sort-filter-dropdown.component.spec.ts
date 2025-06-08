import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortFilterDropdownComponent } from './sort-filter-dropdown.component';

describe('SortFilterDropdownComponent', () => {
  let component: SortFilterDropdownComponent;
  let fixture: ComponentFixture<SortFilterDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortFilterDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortFilterDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
