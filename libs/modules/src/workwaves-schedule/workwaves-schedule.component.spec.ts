import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwavesScheduleComponent } from './workwaves-schedule.component';

describe('WorkwavesScheduleComponent', () => {
  let component: WorkwavesScheduleComponent;
  let fixture: ComponentFixture<WorkwavesScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwavesScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwavesScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
