import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSgaComponent } from './calendar-sga.component';

describe('CalendarSgaComponent', () => {
  let component: CalendarSgaComponent;
  let fixture: ComponentFixture<CalendarSgaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarSgaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarSgaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
