import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarPickingComponent } from './calendar-picking.component';

describe('CalendarPickingComponent', () => {
  let component: CalendarPickingComponent;
  let fixture: ComponentFixture<CalendarPickingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarPickingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarPickingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
