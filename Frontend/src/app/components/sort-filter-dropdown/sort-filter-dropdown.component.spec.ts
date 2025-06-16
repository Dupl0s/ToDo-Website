import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortFilterDropdownComponent } from './sort-filter-dropdown.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SortFilterDropdownComponent', () => {
  let component: SortFilterDropdownComponent;
  let fixture: ComponentFixture<SortFilterDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortFilterDropdownComponent,
        HttpClientTestingModule
      ]
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
