import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwaveListWorkwavesScheduleComponent } from './list-workwave.component';

describe('WorkwaveListWorkwavesScheduleComponent', () => {
  let component: WorkwaveListWorkwavesScheduleComponent;
  let fixture: ComponentFixture<WorkwaveListWorkwavesScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwaveListWorkwavesScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwaveListWorkwavesScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
