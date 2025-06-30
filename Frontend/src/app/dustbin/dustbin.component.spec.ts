import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DustbinComponent } from './dustbin.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('DustbinComponent', () => {
  let component: DustbinComponent;
  let fixture: ComponentFixture<DustbinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DustbinComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DustbinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
